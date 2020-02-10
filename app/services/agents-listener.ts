import Service, { inject as service } from '@ember/service';
import config from 'explorviz-frontend/config/environment';

import DS from 'ember-data';
import { set } from '@ember/object';
import Agent from 'explorviz-frontend/models/agent';
import AgentRepository from './repos/agent-repository';

declare const EventSourcePolyfill: any;

export default class AgentsListener extends Service {
  // https://github.com/segmentio/sse/blob/master/index.js

  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('repos/agent-repository') agentRepo!: AgentRepository;

  content: any = null;

  es: any = null;

  initSSE() {
    set(this, 'content', []);

    const url = config.APP.API_ROOT;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { access_token } = this.session.data.authenticated;

    // Close former event source. Multiple (>= 6) instances cause the ember store to break
    let { es } = this;
    if (es) {
      es.close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    set(this, 'es', new EventSourcePolyfill(`${url}/v1/agents/broadcast/`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        Authorization: `Bearer ${access_token}`,
      },
    }));

    es = this.es;

    set(es, 'onmessage', (event: any) => {
      const agentListJson = JSON.parse(event.data);

      // ATTENTION: Mind the push operation, push != pushPayload in terms of
      // serializer usage
      // https://github.com/emberjs/data/issues/3455
      this.store.pushPayload(agentListJson);

      const idArray: string[] = [];
      const agentRecordList: Agent[] = [];

      agentListJson.data.forEach((agentJson: any) => {
        idArray.push(agentJson.id);
      });

      idArray.forEach((id) => {
        const agentRecord = this.store.peekRecord('agent', id);
        if (agentRecord !== null) {
          agentRecordList.push(agentRecord);
        }
      });

      set(this.agentRepo, 'agentList', agentRecordList);

      // TODO update similar to ... ?
      // this.get('agentRepo').triggerUpdated();
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'agents-listener': AgentsListener;
  }
}
