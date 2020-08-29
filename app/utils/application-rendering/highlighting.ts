import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import DS from 'ember-data';
import Component from 'explorviz-frontend/models/component';
import Trace from 'explorviz-frontend/models/trace';
import TraceStep from 'explorviz-frontend/models/tracestep';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

/**
   * Restores default color and transparency for all application meshes
   *
   * @param applicationObject3D Application mesh of which the highlighting should be removed
   */
export function removeHighlighting(applicationObject3D: ApplicationObject3D) {
  const meshes = applicationObject3D.getAllMeshes();
  meshes.forEach((mesh) => {
    mesh.unhighlight();
  });
  applicationObject3D.highlightedEntity = null;
}

/**
   * Turns the mesh which belongs to a component and all its child meshes if
   * they are not part of the ignorableComponents set.
   *
   * @param component Component which shall be turned transparent
   * @param applicationObject3D Application mesh which contains the component
   * @param ignorableComponents Set of components which shall not be turned transparent
   */
export function turnComponentAndAncestorsTransparent(component: Component,
  applicationObject3D: ApplicationObject3D, ignorableComponents: Set<Component>) {
  if (ignorableComponents.has(component)) { return; }

  ignorableComponents.add(component);

  const parent = component.getParentComponent();

  const componentMesh = applicationObject3D.getBoxMeshbyModelId(component.get('id'));

  if (!parent) {
    if (componentMesh instanceof ComponentMesh) {
      componentMesh.turnTransparent();
    }
    return;
  }

  const parentMesh = applicationObject3D.getBoxMeshbyModelId(parent.get('id'));
  if (componentMesh instanceof ComponentMesh
            && parentMesh instanceof ComponentMesh && parentMesh.opened) {
    componentMesh.turnTransparent();
  }
  turnComponentAndAncestorsTransparent(parent, applicationObject3D, ignorableComponents);
}

/**
   * Highlights a given mesh
   *
   * @param mesh Either component, clazz or clazz communication mesh which shall be highlighted
   * @param applicationObject3D Application mesh which contains the mesh
   * @param toggleHighlighting Determines whether highlighting a already highlighted entity
   *                           causes removal of all highlighting
   */
export function highlight(mesh: ComponentMesh | ClazzMesh | ClazzCommunicationMesh,
  applicationObject3D: ApplicationObject3D, toggleHighlighting = true) {
  // Reset highlighting if highlighted mesh is clicked
  if (mesh.highlighted && toggleHighlighting) {
    removeHighlighting(applicationObject3D);
    return;
  }

  // Reset highlighting
  removeHighlighting(applicationObject3D);
  const model = mesh.dataModel;

  // Highlight the entity itself
  mesh.highlight();
  applicationObject3D.highlightedEntity = mesh;

  // All clazzes in application
  const application = applicationObject3D.dataModel;
  const allClazzesAsArray = application.getAllClazzes();
  const allClazzes = new Set<Clazz>(allClazzesAsArray);

  // Get all clazzes in current component
  const containedClazzes = new Set<Clazz>();

  // Add all clazzes which are contained in a component
  if (model instanceof Component) {
    model.getContainedClazzes(containedClazzes);
    // Add clazz itself
  } else if (model instanceof Clazz) {
    containedClazzes.add(model);
    // Add source and target clazz of communication
  } else if (model instanceof DrawableClazzCommunication) {
    const sourceClazz = model.belongsTo('sourceClazz').value() as Clazz;
    const targetClazz = model.belongsTo('targetClazz').value() as Clazz;
    containedClazzes.add(sourceClazz);
    containedClazzes.add(targetClazz);
    // Given model is not supported
  } else {
    return;
  }

  const allInvolvedClazzes = new Set<Clazz>(containedClazzes);

  const drawableComm = application.hasMany('drawableClazzCommunications').value() as DS.ManyArray<DrawableClazzCommunication>|null;

    drawableComm?.forEach((comm) => {
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
        const commMesh = applicationObject3D.getBoxMeshbyModelId(comm.get('id'));
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

    // Turn non involved clazzes transparent
    nonInvolvedClazzes.forEach((clazz) => {
      const clazzMesh = applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
      const componentMesh = applicationObject3D.getBoxMeshbyModelId(clazz.getParent().get('id'));
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
        clazzMesh.turnTransparent();
      }
      turnComponentAndAncestorsTransparent(clazz.getParent(), applicationObject3D, componentSet);
    });
}

/**
   * Highlights the mesh which belongs to a given data model
   *
   * @param entity Component or clazz of which the corresponding mesh shall be highlighted
   * @param applicationObject3D Application mesh which contains the entity
   */
export function highlightModel(entity: Component|Clazz, applicationObject3D: ApplicationObject3D) {
  const mesh = applicationObject3D.getBoxMeshbyModelId(entity.id);
  if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh) {
    highlight(mesh, applicationObject3D);
  }
}

/**
   * Highlights a trace.
   *
   * @param trace Trace which shall be highlighted
   * @param step Step of the trace which shall be highlighted. Default is 1
   * @param applicationObject3D Application mesh which contains the trace
   */
export function highlightTrace(trace: Trace, applicationObject3D: ApplicationObject3D, step = 1) {
  const application = applicationObject3D.dataModel;

  removeHighlighting(applicationObject3D);

  applicationObject3D.highlightedEntity = trace;

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
    const commMesh = applicationObject3D.getCommMeshByModelId(comm.get('id'));

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
    const clazzMesh = applicationObject3D.getBoxMeshbyModelId(clazz.get('id'));
    const componentMesh = applicationObject3D.getBoxMeshbyModelId(clazz.getParent().get('id'));
    if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
      clazzMesh.turnTransparent();
    }
    turnComponentAndAncestorsTransparent(clazz.getParent(), applicationObject3D, componentSet);
  });
}

/**
   * Highlights the stored highlighted entity again.
   *
   * @param applicationObject3D Application mesh which contains the highlighted entity
   */
export function updateHighlighting(applicationObject3D: ApplicationObject3D) {
  const { highlightedEntity } = applicationObject3D;

  if (!highlightedEntity) {
    return;
  }

  // Re-run highlighting for entity
  if (highlightedEntity instanceof ClazzMesh
        || highlightedEntity instanceof ComponentMesh
        || highlightedEntity instanceof ClazzCommunicationMesh) {
    highlight(highlightedEntity, applicationObject3D, false);
  }
}
