
import * as helper from '../helpers'
import { UserServices } from '../services';
import { addingNewUser } from '.';

const adminNamespace = (io) => {
    const admin_namespace = io.of('/admin');

    let decodedToken

    // middleware for authentication
    admin_namespace.use(async (socket, next) => {
        const { access_token } = socket.handshake.headers;
        try {
        if (access_token) {
            decodedToken = await helper.token.decode(access_token);
            const user = await UserServices.getUser(decodedToken.id);
            if(user.role !== 'admin'){
                throw new Error("Not authorized, Only Admin!");
            }
            socket.decodedToken = decodedToken;
            return next();
        }
        throw new Error("Access token not provided in headers!");
        } catch (error) {
        return next(error);
        }
    });
  
    // Event handlers for admin namespace
    admin_namespace.on('connection', (socket) => {
        console.log('Admin Socket connected');
        addingNewUser(socket.decodedToken.id, socket.id)

        socket.on('disconnect', ()=> {
            console.log('Admin socket disconnected!')
        })
    });

    // Custom event handlers for emitting events
    const emitToAdmin = (eventName, eventData) => {
        admin_namespace.emit(eventName, eventData);
    };

    return {
        admin_namespace,
        emitToAdmin
    }

  };
  
export default adminNamespace
