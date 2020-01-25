import Component from '@glimmer/component';

export default class MonitoringInformation extends Component {
  tooltipTexts = {
    aopContent: `The aop.xml file contains instruction for monitoring.
      The embedded include element considers all classes for monitoring.
      You can try to start your monitoring with this approach,
      but experience showed that this fails most of the time.
      Alternatively, insert the source code package which you want to monitor recursively.`,
    monitoredFlag: `Use this button to enable or disable the monitoring for this rocess.
      Restart is necessary.`,
  };
}
