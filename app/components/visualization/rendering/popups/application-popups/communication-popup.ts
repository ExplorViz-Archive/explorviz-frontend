import GlimmerComponent from '@glimmer/component';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';

interface Args {
  communication: DrawableClazzCommunication
}

export default class CommunicationPopup extends GlimmerComponent<Args> {
  get isBidirectional() {
    return this.args.communication.get('isBidirectional');
  }

  get sourceClazz() {
    return this.args.communication.get('sourceClazz').get('name');
  }

  get targetClazz() {
    return this.args.communication.get('targetClazz').get('name');
  }

  get requests() {
    return this.args.communication.get('requests');
  }

  get traceSize() {
    return this.args.communication.get('containedTraces').size;
  }

  get responseTime() {
    function round(value: number, precision: number): number {
      const multiplier = 10 ** precision;
      return Math.round(value * multiplier) / multiplier;
    }

    return round(this.args.communication.get('averageResponseTime'), 2);
  }
}
