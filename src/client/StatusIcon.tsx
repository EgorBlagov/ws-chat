import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as classnames from "classnames";
import * as React from "react";
import "./StatusIcon.css";

interface IProps {
    active: boolean;
}

export const StatusIcon = ({ active }: IProps) => {
    return active ? (
        <div className={classnames("status-icon status-icon--active")} />
    ) : (
        <FontAwesomeIcon className="status-icon status-icon--error" icon={faTimes} />
    );
};
