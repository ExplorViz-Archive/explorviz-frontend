import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import Application from 'explorviz-frontend/models/application';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import DS from 'ember-data';
import Component from 'explorviz-frontend/models/component';
import Trace from 'explorviz-frontend/models/trace';
import TraceStep from 'explorviz-frontend/models/tracestep';

export default class Highlighting {
  // References to mesh maps of rendering
  modelIdToMesh: Map<string, BaseMesh> = new Map();

  commIdToMesh: Map<string, ClazzCommunicationMesh> = new Map();

  highlightedEntity: BaseMesh | null = null;

  constructor(modelIdToMesh: Map<string, BaseMesh>,
    commIdToMesh: Map<string, ClazzCommunicationMesh>) {
    this.modelIdToMesh = modelIdToMesh;
    this.commIdToMesh = commIdToMesh;
  }

  highlight(mesh: ComponentMesh | ClazzMesh | ClazzCommunicationMesh,
    application: Application, toggleHighlighting = true): void {
    // Reset highlighting if highlighted mesh is clicked
    if (mesh.highlighted && toggleHighlighting) {
      this.removeHighlighting();
      return;
    }

    // Reset highlighting
    this.removeHighlighting();
    const model = mesh.dataModel;

    // Highlight the entity itself
    mesh.highlight();
    this.highlightedEntity = mesh;

    // All clazzes in application
    const allClazzesAsArray = application.getAllClazzes();
    const allClazzes = new Set<Clazz>(allClazzesAsArray);

    // Get all clazzes in current component
    const containedClazzes = new Set<Clazz>();

    if (model instanceof Component) {
      model.getContainedClazzes(containedClazzes);
    } else if (model instanceof Clazz) {
      containedClazzes.add(model);
    } else if (model instanceof DrawableClazzCommunication) {
      const sourceClazz = model.belongsTo('sourceClazz').value() as Clazz;
      const targetClazz = model.belongsTo('targetClazz').value() as Clazz;
      containedClazzes.add(sourceClazz);
      containedClazzes.add(targetClazz);
    } else {
      return;
    }

    const allInvolvedClazzes = new Set<Clazz>(containedClazzes);

    const drawableComm = application.hasMany('drawableClazzCommunications').value() as DS.ManyArray<DrawableClazzCommunication>|null;

    if (!drawableComm) {
      return;
    }


    drawableComm.forEach((comm) => {
      const sourceClazz = comm.belongsTo('sourceClazz').value() as Clazz;
      const targetClazz = comm.belongsTo('targetClazz').value() as Clazz;

      // Add clazzes which communicate directly with highlighted entity
      // For a highlighted communication all involved clazzes are already known
      if (containedClazzes.has(sourceClazz)
          && !(model instanceof DrawableClazzCommunication)) {
        allInvolvedClazzes.add(targetClazz);
      } else if (containedClazzes.has(targetClazz)
          && !(model instanceof DrawableClazzCommunication)) {
        allInvolvedClazzes.add(sourceClazz);
        // Hide communication which is not directly connected to highlighted entity
      } else if (!containedClazzes.has(sourceClazz) || !containedClazzes.has(targetClazz)) {
        const commMesh = this.commIdToMesh.get(comm.get('id'));
        if (commMesh) {
          commMesh.turnTransparent();
        }
      }
    });

    const nonInvolvedClazzes = new Set([...allClazzes].filter((x) => !allInvolvedClazzes.has(x)));

    const componentSet = new Set<Component>();

    allInvolvedClazzes.forEach((clazz) => {
      clazz.getParent().getAllAncestorComponents(componentSet);
    });

    nonInvolvedClazzes.forEach((clazz) => {
      const clazzMesh = this.modelIdToMesh.get(clazz.get('id'));
      const componentMesh = this.modelIdToMesh.get(clazz.getParent().get('id'));
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
        clazzMesh.turnTransparent();
      }
      this.turnComponentAndAncestorsTransparent(clazz.getParent(), componentSet);
    });
  }

  highlightModel(entity: Component|Clazz, application: Application) {
    const mesh = this.modelIdToMesh.get(entity.id);
    if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh) {
      this.highlight(mesh, application);
    }
  }

  highlightTrace(trace: Trace, step = 1, application: Application) {
    this.removeHighlighting();

    const drawableComms = application.hasMany('drawableClazzCommunications').value() as DS.ManyArray<DrawableClazzCommunication>|null;

    if (!drawableComms) {
      return;
    }

    // All clazzes in application
    const allClazzesAsArray = application.getAllClazzes();
    const allClazzes = new Set<Clazz>(allClazzesAsArray);

    const involvedClazzes = new Set<Clazz>();

    let highlightedTraceStep: TraceStep;

    trace.get('traceSteps').forEach((traceStep) => {
      if (traceStep.tracePosition === step) {
        highlightedTraceStep = traceStep;
      }
    });


    drawableComms.forEach((comm) => {
      const commMesh = this.commIdToMesh.get(comm.get('id'));

      if (comm.containedTraces.has(trace)) {
        const sourceClazz = comm.belongsTo('sourceClazz').value() as Clazz;
        const targetClazz = comm.belongsTo('targetClazz').value() as Clazz;
        involvedClazzes.add(sourceClazz);
        involvedClazzes.add(targetClazz);
        if (comm.containedTraceSteps.has(highlightedTraceStep)) {
              commMesh?.highlight();
        }
      } else {
            commMesh?.turnTransparent();
      }
    });

    const nonInvolvedClazzes = new Set([...allClazzes].filter((x) => !involvedClazzes.has(x)));

    const componentSet = new Set<Component>();
    involvedClazzes.forEach((clazz) => {
      clazz.getParent().getAllAncestorComponents(componentSet);
    });

    nonInvolvedClazzes.forEach((clazz) => {
      const clazzMesh = this.modelIdToMesh.get(clazz.get('id'));
      const componentMesh = this.modelIdToMesh.get(clazz.getParent().get('id'));
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
        clazzMesh.turnTransparent();
      }
      this.turnComponentAndAncestorsTransparent(clazz.getParent(), componentSet);
    });
  }

  updateHighlighting(application: Application) {
    const { highlightedEntity } = this;

    if (!highlightedEntity) {
      return;
    }

    if (highlightedEntity instanceof ClazzMesh
        || highlightedEntity instanceof ComponentMesh
        || highlightedEntity instanceof ClazzCommunicationMesh) {
      this.highlight(highlightedEntity, application, false);
    }
  }

  removeHighlighting() {
    const boxMeshes = Array.from(this.modelIdToMesh.values());
    const commMeshes = Array.from(this.commIdToMesh.values());
    const meshes = boxMeshes.concat(commMeshes);
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (mesh instanceof BaseMesh) {
        mesh.unhighlight();
      }
    }
    this.highlightedEntity = null;
  }

  turnComponentAndAncestorsTransparent(component: Component, ignorableComponents: Set<Component>) {
    if (ignorableComponents.has(component)) { return; }

    ignorableComponents.add(component);

    const parent = component.getParentComponent();

    const componentMesh = this.modelIdToMesh.get(component.get('id'));

    if (!parent) {
      if (componentMesh instanceof ComponentMesh) {
        componentMesh.turnTransparent();
      }
      return;
    }

    const parentMesh = this.modelIdToMesh.get(parent.get('id'));
    if (componentMesh instanceof ComponentMesh
          && parentMesh instanceof ComponentMesh && parentMesh.opened) {
      componentMesh.turnTransparent();
    }
    this.turnComponentAndAncestorsTransparent(parent, ignorableComponents);
  }
}
