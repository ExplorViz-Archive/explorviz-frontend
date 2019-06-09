import Service from '@ember/service';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import Trace from 'explorviz-frontend/models/trace';
import TraceStep from 'explorviz-frontend/models/tracestep';
import Application from 'explorviz-frontend/models/application';
import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';
import { computed } from '@ember/object';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';

export default class Highlighter extends Service {

  @service('store') store!: DS.Store;

  @service('rendering-service')
  renderingService!: RenderingService;

  highlightedEntity:Component|Clazz|Trace|DrawableClazzCommunication|null = null;
  application:Application|null = null;
  traceId:number|null = null;
  currentTracePosition:number|null = null;
  currentTraceStep:TraceStep|null = null;

  @computed('highlightedEntity')
  get isTrace(this: Highlighter) {
    return this.get('highlightedEntity') instanceof Trace;
  }

  highlight(entity: any) {
    const isHighlighted = entity.get('highlighted');

    if (!isHighlighted) {
      this.unhighlightAll();
      entity.highlight();
      this.set('highlightedEntity', entity);
    } else {
      this.unhighlightAll();
    }
  }

  highlightTrace(trace:Trace) {
    this.unhighlightAll();
    trace.highlight();
    trace.openParents();
    this.set('highlightedEntity', trace);
    this.set('currentTracePosition', 1);
    this.highlightTraceStep(1);
  }

  highlightTraceStep(this: Highlighter, position: number) {
    let trace = this.get('highlightedEntity');
    if(!(trace instanceof Trace))
      return;

    // Make sure a trace is highlighted
    if (!this.get('currentTracePosition')) {
      return;
    }

    // Check if position is valid
    if (position < 1 || position > trace.get('length')) {
      return;
    }

    this.set('currentTracePosition', position);
    this.set('currentTraceStep', trace.get('traceSteps').objectAt(position - 1));

    trace.get('traceSteps').forEach((traceStep:TraceStep) => {
      if (traceStep.get('tracePosition') === position) {
        traceStep.highlight();
      } else {
        traceStep.unhighlight();
      }
    });
  }

  highlightPreviousTraceStep(this: Highlighter) {
    const tracePos = this.get('currentTracePosition');
    if(tracePos !== null) {
      this.highlightTraceStep(tracePos - 1);
    }
  }

  highlightNextTraceStep(this: Highlighter) {
    const tracePos = this.get('currentTracePosition');
    if(tracePos !== null) {
      this.highlightTraceStep(tracePos + 1);
    }
  }

  unhighlightAll(this: Highlighter) {
    if (this.get('highlightedEntity')) {

      this.set('highlightedEntity', null);
      this.set('traceId', null);
      this.set('currentTracePosition', null);
      this.set('currentTraceStep', null);

      let application = this.get('application');
      if (application !== null) {
        application.unhighlight();
      }
    }
  }

  applyHighlighting(this: Highlighter) {
    const self = this;
    const highlightedEntity = this.get('highlightedEntity');
    const application = this.get('application');

    if (highlightedEntity === null || application === null) {
      return;
    }

    // Unhighlight entity if it is not visible
    if ((highlightedEntity instanceof Clazz || highlightedEntity instanceof Component || highlightedEntity instanceof DrawableClazzCommunication)
      && !highlightedEntity.isVisible()) {
      this.unhighlightAll();
      this.get('renderingService').redrawScene();
      return;
    }

    // Shall contain all clazzes which the user directly or indirectly highlighted
    let selectedClazzes: Set<Clazz> = new Set();
    computeSelectedClazzes();

    // Shall contain all clazzes which the user highlighted or which communicate with a highlighted clazz
    let communicatingClazzes = new Set(selectedClazzes);

    // Set states (either "NORMAL" or "TRANSPARENT") of communcation for highlighting
    if (highlightedEntity instanceof Component || highlightedEntity instanceof Clazz) {
      this.applyCommunicationHighlighting(selectedClazzes, communicatingClazzes);
    } else if (highlightedEntity instanceof DrawableClazzCommunication) {
      // Highlight communication lines
      application.get('drawableClazzCommunications').forEach((communication:DrawableClazzCommunication) => {
        if (communicatingClazzes.has(communication.get('sourceClazz')) &&
          communicatingClazzes.has(communication.get('targetClazz'))) {
          communication.highlight()
        }
        else {
          communication.unhighlight();
        }
      });
    } else if (highlightedEntity instanceof Trace) {
      prepareTraceHighlighting();
    }


    // Iterate recursively over all application entities and update states
    application.get('components').forEach((component) => {
      this.applyNodeHighlighting(component, communicatingClazzes);
    });

    function computeSelectedClazzes() {
      if (highlightedEntity instanceof Clazz) {
        // Add only clazz itself
        selectedClazzes.add(highlightedEntity);
      } else if (highlightedEntity instanceof Component) {
        // Add all clazzes of component
        highlightedEntity.getContainedClazzes(selectedClazzes);
      } else if (highlightedEntity instanceof DrawableClazzCommunication) {
        // Add source and target clazz of communication
        selectedClazzes.add(highlightedEntity.get('sourceClazz'));
        selectedClazzes.add(highlightedEntity.get('targetClazz'));
      } else if (highlightedEntity instanceof Trace) {
        if(application === null)
          return;
        // Add all clazzes involved in communication of trace
        application.get('drawableClazzCommunications').forEach((communication) => {
          let communicationTraces = communication.get('containedTraces');
          if (communicationTraces.has(highlightedEntity)) {
            // Add the source and target clazz of a communication for a traceStep
            selectedClazzes.add(communication.get('sourceClazz'));
            selectedClazzes.add(communication.get('targetClazz'));
          }
        });
      }
    }

    function prepareTraceHighlighting() {
      // Unhighlight communication
      if(application === null || highlightedEntity === null || !(highlightedEntity instanceof Trace))
        return;

      application.get('drawableClazzCommunications').forEach((drawableCommunication) => {
        drawableCommunication.unhighlight();
      });

      // Highlight communication which contains current trace step
      application.get('drawableClazzCommunications').forEach((drawableCommunication) => {
        if (drawableCommunication.get('containedTraces').has(highlightedEntity)) {
          drawableCommunication.set('state', 'NORMAL');
        }
        drawableCommunication.get('aggregatedClazzCommunications').forEach((aggregatedComm) => {
          aggregatedComm.get('clazzCommunications').forEach((comm) => {
            comm.get('traceSteps').forEach((traceStep) => {
              if (traceStep.get('parentTrace').get('traceId') === highlightedEntity.get('traceId') &&
                traceStep.get('tracePosition') === self.get('currentTracePosition')) {
                drawableCommunication.highlight();
                // Set source and target clazz according to highlighted traceStep
                if (traceStep.get('clazzCommunication').get('sourceClazz').get('id') !== drawableCommunication.get('sourceClazz').get('id')) {
                  drawableCommunication.toggleCommunicationDirection();
                }
              }
            });
          });
        });
      });
    }
  }

  /**
   * Marks communication between clazzes as NORMAL or TRANSPARENT for highlighting, only used if a component or clazz is highlighted
   * @param {*} selectedClazzes      Clazzes which are (indirectly) highlighted
   * @param {*} communicatingClazzes Clazzes which communicate with selectedClazzes (including selectedClazzes itself)
   * @method applyCommunicationHighlighting
   */
  applyCommunicationHighlighting(this: Highlighter, selectedClazzes:Set<Clazz>, communicatingClazzes:Set<Clazz>) {
    let application = this.get('application');

    if(application === null)
      return;

    const clazzCommunications = application.get('drawableClazzCommunications');

    clazzCommunications.forEach((clazzCommunication) => {
      let toBeHighlighted = false;

      // Highlight all communication lines which have a selected clazz as an endpoint
      selectedClazzes.forEach((clazz) => {
        if (clazzCommunication.get('sourceClazz').get('id') === clazz.get('id')) {
          communicatingClazzes.add(clazzCommunication.get('targetClazz'));
          toBeHighlighted = true;
        } else if (clazzCommunication.get('targetClazz').get('id') === clazz.get('id')) {
          communicatingClazzes.add(clazzCommunication.get('sourceClazz'));
          toBeHighlighted = true;
        }
      });

      // Mark clazzes as transparent which do not communicate with a highlighted entity
      if (toBeHighlighted) {
        clazzCommunication.set("state", "NORMAL");
      } else {
        clazzCommunication.set("state", "TRANSPARENT");
      }
    });
  }

  /**
   * Sets all (nested) entities (components & clazzes) of a component either to TRANSPARENT or NORMAL for highlighting
   * @param {component} component             Component which entities shall be updated
   * @param {Set}       communicatingClazzes  Contains all clazzes which are involved in communication with highlighted entity
   * @method applyNodeHighlighting
   * 
   */
  applyNodeHighlighting(component:Component, communicatingClazzes:Set<Clazz>) {
    let isPartOfHighlighting = false;
    let componentClazzes: Set<Clazz> = new Set();

    component.getContainedClazzes(componentClazzes);

    // Check if component contains a class which is part of highlighting
    communicatingClazzes.forEach((clazz) => {
      componentClazzes.forEach((componentClazz) => {
        if (clazz.get('id') === componentClazz.get('id')) {
          isPartOfHighlighting = true;
        }
      });
    });

    // Mark component as transparent if no contained clazz communicates with a highlighted clazz
    if (isPartOfHighlighting) {
      component.set('state', 'NORMAL');
    } else {
      component.set('state', 'TRANSPARENT');
    }

    // Mark clazzes as transparent if they are not involved in communication with highlighted clazzes
    component.get('clazzes').forEach((clazz) => {
      let isCommunicatingClazz = false;
      communicatingClazzes.forEach((componentClazz) => {
        if (clazz.get('id') === componentClazz.get('id')) {
          isCommunicatingClazz = true;
        }
      });
      if (isCommunicatingClazz) {
        clazz.set('state', "NORMAL");
      } else {
        clazz.set('state', "TRANSPARENT");
      }
    });

    // Recursion: Check state also for underlying components (and clazzes)
    component.get('children').forEach((child) => {
      this.applyNodeHighlighting(child, communicatingClazzes);
    });
  }

}

declare module "@ember/service" {
  interface Registry {
    "visualization/application/highlighter": Highlighter;
  }
}
