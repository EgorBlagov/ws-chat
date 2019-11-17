import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as classnames from "classnames";
import * as React from "react";

interface IProps {
    active: boolean;
}

export const StatusIcon = ({ active }: IProps) => {
    return (
        <div className="main__status-icon-wrapper">
            {active ? (
                <div className={classnames("main__status-icon animated", { active, error: !active })} />
            ) : (
                <FontAwesomeIcon className="main__status-error error-flash" icon={faTimes} />
            )}
        </div>
    );
};
