import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { tracked } from '@glimmer/tracking';
import {
  Application, Class, isClass, isPackage, Package, StructureLandscapeData,
} from '../landscape-schemes/structure-data';
import { DrawableClassCommunication, isDrawableClassCommunication, createHashCodeToClassMap } from '../landscape-rendering/class-communication-computer';
import { Span, Trace } from '../landscape-schemes/dynamic-data';

export default class Highlighting {
  applicationObject3D: ApplicationObject3D;

  @tracked
  highlightedEntity: BaseMesh | Trace | null = null;

  constructor(applicationObject3D: ApplicationObject3D) {
    this.applicationObject3D = applicationObject3D;
  }

  /**
   * Highlights a given mesh
   *
   * @param mesh Either component, clazz or clazz communication mesh which shall be highlighted
   * @param toggleHighlighting Determines whether highlighting a already highlighted entity
   *                           causes removal of all highlighting
   */
  highlight(mesh: ComponentMesh | ClazzMesh | ClazzCommunicationMesh,
    communication: DrawableClassCommunication[], toggleHighlighting = true): void {
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
    const application = this.applicationObject3D.dataModel;
    const allClazzesAsArray = Highlighting.getAllClazzes(application);
    const allClazzes = new Set<Class>(allClazzesAsArray);

    // Get all clazzes in current component
    const containedClazzes = new Set<Class>();

    // Add all clazzes which are contained in a component
    if (isPackage(model)) {
      Highlighting.getContainedClazzes(model, containedClazzes);
    // Add clazz itself
    } else if (isClass(model)) {
      containedClazzes.add(model);
    // Add source and target clazz of communication
    } else if (isDrawableClassCommunication(model)) {
      containedClazzes.add(model.sourceClass);
      containedClazzes.add(model.targetClass);
    // Given model is not supported
    } else {
      return;
    }

    const allInvolvedClazzes = new Set<Class>(containedClazzes);

    communication.forEach((comm) => {
      const { sourceClass, targetClass, id } = comm;

      // Add clazzes which communicate directly with highlighted entity
      // For a highlighted communication all involved clazzes are already known
      if (containedClazzes.has(sourceClass)
          && !(isDrawableClassCommunication(model))) {
        allInvolvedClazzes.add(targetClass);
      } else if (containedClazzes.has(targetClass)
          && !(isDrawableClassCommunication(model))) {
        allInvolvedClazzes.add(sourceClass);
        // Hide communication which is not directly connected to highlighted entity
      } else if (!containedClazzes.has(sourceClass) || !containedClazzes.has(targetClass)) {
        const commMesh = this.applicationObject3D.getCommMeshByModelId(id);
        if (commMesh) {
          commMesh.turnTransparent();
        }
        // communication is self-looped and not equal to the highlighted one, i.e. model
      } else if (isDrawableClassCommunication(model) && sourceClass === targetClass
        && model !== comm) {
        const commMesh = this.applicationObject3D.getCommMeshByModelId(id);
        if (commMesh) {
          commMesh.turnTransparent();
        }
      }
    });

    const nonInvolvedClazzes = new Set([...allClazzes].filter((x) => !allInvolvedClazzes.has(x)));

    const componentSet = new Set<Package>();

    allInvolvedClazzes.forEach((clazz) => {
      Highlighting.getAllAncestorComponents(clazz.parent, componentSet);
    });

    // Turn non involved clazzes transparent
    nonInvolvedClazzes.forEach((clazz) => {
      const clazzMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.id);
      const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.parent.id);
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
        clazzMesh.turnTransparent();
      }
      this.turnComponentAndAncestorsTransparent(clazz.parent, componentSet);
    });
  }

  /**
   * Highlights the mesh which belongs to a given data model
   *
   * @param entity Component or clazz of which the corresponding mesh shall be highlighted
   */
  highlightModel(entity: Package|Class, communication: DrawableClassCommunication[]) {
    const mesh = this.applicationObject3D.getBoxMeshbyModelId(entity.id);
    if (mesh instanceof ComponentMesh || mesh instanceof ClazzMesh) {
      this.highlight(mesh, communication);
    }
  }

  /**
   * Highlights a trace.
   *
   * @param trace Trace which shall be highlighted
   * @param step Step of the trace which shall be highlighted. Default is 1
   * @param application Application which belongs to the trace
   */
  highlightTrace(trace: Trace, traceStep: string, application: Application,
    communication: DrawableClassCommunication[], landscapeStructureData: StructureLandscapeData) {
    this.removeHighlighting();

    this.highlightedEntity = trace;

    const drawableComms = communication;

    // All clazzes in application
    const allClazzesAsArray = Highlighting.getAllClazzes(application);
    const allClazzes = new Set<Class>(allClazzesAsArray);

    const involvedClazzes = new Set<Class>();

    let highlightedSpan: Span|undefined;

    const hashCodeToClassMap = createHashCodeToClassMap(landscapeStructureData);

    trace.spanList.forEach((span) => {
      if (span.spanId === traceStep) {
        highlightedSpan = span;
      }
    });

    if (highlightedSpan === undefined) {
      return;
    }

    // get classes of highlighted span
    let highlightedSpanParentClass: Class|undefined;
    const highlightedSpanClass = hashCodeToClassMap.get(highlightedSpan.hashCode);
    trace.spanList.forEach((span) => {
      if (highlightedSpan === undefined) {
        return;
      }
      if (span.spanId === highlightedSpan.parentSpanId) {
        highlightedSpanParentClass = hashCodeToClassMap.get(span.hashCode);
      }
    });

    // mark all classes in span as involved in the trace
    trace.spanList.forEach((span) => {
      const spanClass = hashCodeToClassMap.get(span.hashCode);

      if (spanClass) {
        involvedClazzes.add(spanClass);
      }
    });

    const spanIdToClass = new Map<string, Class>();

    trace.spanList.forEach((span) => {
      const { hashCode, spanId } = span;

      const clazz = hashCodeToClassMap.get(hashCode);

      if (clazz !== undefined) {
        spanIdToClass.set(spanId, clazz);
      }
    });

    // strings of format sourceClass_to_targetClass
    const classesThatCommunicateInTrace = new Set<string>();

    trace.spanList.forEach((span) => {
      const { parentSpanId, spanId } = span;

      if (parentSpanId === '') {
        return;
      }

      const sourceClass = spanIdToClass.get(parentSpanId);
      const targetClass = spanIdToClass.get(spanId);

      if (sourceClass !== undefined && targetClass !== undefined) {
        classesThatCommunicateInTrace.add(`${sourceClass.id}_to_${targetClass.id}`);
      }
    });

    drawableComms.forEach((comm) => {
      const { sourceClass, targetClass, id } = comm;

      const commMesh = this.applicationObject3D.getCommMeshByModelId(id);

      // highlight communication mesh that matches highlighted span
      if ((sourceClass === highlightedSpanParentClass && targetClass === highlightedSpanClass)
        || (sourceClass === highlightedSpanClass && targetClass === highlightedSpanParentClass)) {
        commMesh?.highlight();
      }

      if (!classesThatCommunicateInTrace.has(`${sourceClass.id}_to_${targetClass.id}`)
        && !classesThatCommunicateInTrace.has(`${targetClass.id}_to_${sourceClass.id}`)) {
        commMesh?.turnTransparent();
      }
    });

    const nonInvolvedClazzes = new Set([...allClazzes].filter((x) => !involvedClazzes.has(x)));

    const componentSet = new Set<Package>();
    involvedClazzes.forEach((clazz) => {
      Highlighting.getAllAncestorComponents(clazz.parent, componentSet);
    });

    nonInvolvedClazzes.forEach((clazz) => {
      const clazzMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.id);
      const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(clazz.parent.id);
      if (clazzMesh instanceof ClazzMesh && componentMesh instanceof ComponentMesh
            && componentMesh.opened) {
        clazzMesh.turnTransparent();
      }
      this.turnComponentAndAncestorsTransparent(clazz.parent, componentSet);
    });
  }

  /**
   * Highlights the stored highlighted entity again.
   */
  updateHighlighting(communication: DrawableClassCommunication[]) {
    if (!this.highlightedEntity) {
      return;
    }

    if (this.highlightedEntity instanceof ClazzCommunicationMesh) {
      const possiblyNewMeshInstance = this.applicationObject3D
        .getCommMeshByModelId(this.highlightedEntity.dataModel.id);

      if (possiblyNewMeshInstance) {
        this.highlightedEntity = possiblyNewMeshInstance;
      } else {
        // communication mesh no longer visible
        this.removeHighlighting();
      }
    }

    // Re-run highlighting for entity
    if (this.highlightedEntity instanceof ClazzMesh
        || this.highlightedEntity instanceof ComponentMesh
        || this.highlightedEntity instanceof ClazzCommunicationMesh) {
      this.highlight(this.highlightedEntity, communication, false);
    }
  }

  /**
   * Restores default color and transparency for all application meshes
   */
  removeHighlighting() {
    const meshes = this.applicationObject3D.getAllMeshes();
    meshes.forEach((mesh) => {
      mesh.unhighlight();
    });
    this.highlightedEntity = null;
  }

  /**
   * Turns the mesh which belongs to a component and all its child meshes if
   * they are not part of the ignorableComponents set.
   *
   * @param component Component which shall be turned transparent
   * @param ignorableComponents Set of components which shall not be turned transparent
   */
  turnComponentAndAncestorsTransparent(component: Package, ignorableComponents: Set<Package>) {
    if (ignorableComponents.has(component)) { return; }

    ignorableComponents.add(component);

    const { parent } = component;

    const componentMesh = this.applicationObject3D.getBoxMeshbyModelId(component.id);

    if (parent === undefined) {
      if (componentMesh instanceof ComponentMesh) {
        componentMesh.turnTransparent();
      }
      return;
    }

    const parentMesh = this.applicationObject3D.getBoxMeshbyModelId(parent.id);
    if (componentMesh instanceof ComponentMesh
          && parentMesh instanceof ComponentMesh && parentMesh.opened) {
      componentMesh.turnTransparent();
    }
    this.turnComponentAndAncestorsTransparent(parent, ignorableComponents);
  }

  static getAllClazzes(application: Application) {
    let clazzes: Class[] = [];

    function getAllClazzesFromComponent(component: Package) {
      clazzes = clazzes.concat(component.classes);
      component.subPackages.forEach((subComponent) => {
        getAllClazzesFromComponent(subComponent);
      });
    }

    application.packages.forEach((component) => {
      getAllClazzesFromComponent(component);
    });

    return clazzes;
  }

  static getAllAncestorComponents(component: Package, componentSet: Set<Package> = new Set()) {
    function getAncestors(comp: Package, set: Set<Package>) {
      if (set.has(comp)) { return; }

      set.add(comp);

      const { parent } = comp;
      if (parent === undefined) {
        return;
      }

      getAncestors(parent, set);
    }

    getAncestors(component, componentSet);

    return componentSet;
  }

  static getContainedClazzes(component: Package, containedClazzes: Set<Class>) {
    const clazzes = component.classes;

    clazzes.forEach((clazz) => {
      containedClazzes.add(clazz);
    });

    const children = component.subPackages;

    children.forEach((child) => {
      Highlighting.getContainedClazzes(child, containedClazzes);
    });
  }
}
