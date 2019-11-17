import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../common/utils";
import { SocketEventHandler, SocketEvents } from "../common/websocket-declaration";
import { socket } from "./socket-client";

export function useSocketHandler<T extends SocketEvents>(socketEvent: T, handler: SocketEventHandler<T>) {
    React.useEffect(() => {
        socket.handle(socketEvent, handler);
        return () => {
            socket.removeHandler(socketEvent, handler);
        };
    });
}

export function useSocketConnected(options: { onConnect?: () => void; onDisconnect?: () => void }) {
    const [connected, setConnected] = React.useState<boolean>(false);
    React.useEffect(() => {
        const connectedHandler = () => {
            if (isOk(options.onConnect)) {
                options.onConnect();
            }
            setConnected(true);
        };

        const disconnectedHandler = () => {
            if (isOk(options.onDisconnect)) {
                options.onDisconnect();
            }
            setConnected(false);
        };

        setConnected(socket.connected);

        if (socket.connected) {
            connectedHandler();
        } else {
            disconnectedHandler();
        }

        socket.handleRaw("connect", connectedHandler);
        socket.handleRaw("disconnect", disconnectedHandler);
        return () => {
            socket.removeHandlerRaw("connect", connectedHandler);
            socket.removeHandlerRaw("disconnect", disconnectedHandler);
        };
    }, []);

    return connected;
}

export function useConditionResolver<T extends any[]>(
    deps: T,
): (condition: (data: T) => boolean, action: (data: T) => void) => void {
    type TCondition = (data: T) => boolean;
    type TAction = (data: T) => void;
    interface IConditionAction {
        condition: TCondition;
        action: TAction;
    }

    const [actions, setActions] = React.useState<IConditionAction[]>([]);

    const setter = (condition: TCondition, action: TAction) => {
        setActions(p => [
            ...p,
            {
                action,
                condition,
            },
        ]);
    };

    React.useEffect(() => {
        const newActions: IConditionAction[] = [];
        let changed: boolean = false;
        _.each(actions, action => {
            if (action.condition(deps)) {
                action.action(deps);
                changed = true;
            } else {
                newActions.push(action);
            }
        });

        if (changed) {
            setActions(newActions);
        }
    }, [...deps, actions]);

    return setter;
}
