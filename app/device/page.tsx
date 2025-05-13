import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

export default function Device() {
    // const webURL = "http://localhost:3000";
    const webURL = "https://scaling-space-journey-pvg5xjqx99j25vx-3000.app.github.dev/manage";
    // const webURL = "https://quizify.wedly.info";
    return (
        <div className='h-dvh w-full flex justify-center items-center'>
            <DeviceFrameset device="iPhone X" color="black" landscape={false}>
                <iframe className="pt-[30px]" width="100%" height="100%" src={webURL} title="Trang web"></iframe>
            </DeviceFrameset>
        </div>
    );
}
