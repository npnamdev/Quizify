declare module 'react-device-frame' {
  import * as React from 'react';

  interface DeviceFramesetProps {
    device?: string;
    color?: string;
    landscape?: boolean;
    zoom?: number;
    children?: React.ReactNode;
  }

  export class DeviceFrameset extends React.Component<DeviceFramesetProps> {}
}
