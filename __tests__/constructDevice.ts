import { constructDevice } from '../lib/commands/abstract/devices';

describe('Construct device tests', () => {
    it('Should construct usb device', () => {
        const device = constructDevice(
            [
                'b137f5dc',
                'device',
                'usb:337641472X',
                'product:FP4eea',
                'model:FP4',
                'device:FP4',
                'transport_id:1'
            ].join(' ')
        );
        expect(device).toEqual({
            device: 'FP4',
            id: 'b137f5dc',
            model: 'FP4',
            path: '337641472X',
            product: 'FP4eea',
            state: 'device',
            transport: 'usb',
            transportId: '1'
        });
    });

    it('Should construct local ipv4 device with port', () => {
        const device = constructDevice(
            [
                '192.168.0.5:5555',
                'device',
                'usb:337641472X',
                'product:FP4eea',
                'model:FP4',
                'device:FP4',
                'transport_id:1'
            ].join(' ')
        );
        expect(device).toEqual({
            device: 'FP4',
            id: '192.168.0.5:5555',
            model: 'FP4',
            path: '337641472X',
            product: 'FP4eea',
            state: 'device',
            transport: 'local',
            transportId: '1'
        });
    });
});
