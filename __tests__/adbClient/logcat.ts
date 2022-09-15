// import AdbMock from '../../mockery/mockAdbServer';
// import AdbClient from '../../lib/client';
// import { UnexpectedDataError } from '../../lib';
// import { promisify } from 'util';

// describe('Key event', () => {
//     it('OKAY with one input', async () => {
//         const adbMock = new AdbMock([
//             {
//                 cmd: 'host:transport:serial',
//                 res: null,
//                 rawRes: true
//             },
//             {
//                 cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
//                 res: null,
//                 rawRes: true
//             },
//             {
//                 cmd: '',
//                 res: `B  �   �   }� c�;.    -  lowmemorykiller Using psi monitors for memory pressure detection `,
//                 rawRes: true
//             }
//         ]);
//         try {
//             const port = await adbMock.start();
//             const adb = new AdbClient({ noAutoStart: true, port });
//             const result = await adb.openLogcat('serial');
//             await promisify((cb) => {
//                 result.on('entry', (entry) => {
//                     cb(null, entry);
//                     console.log(entry);
//                 });
//             })();
//         } finally {
//             await adbMock.end();
//         }
//     });
// });
