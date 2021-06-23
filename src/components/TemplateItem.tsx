import * as React from "react";

type TemplateItemProps = {
    text: string
    onPress: (ev: React.MouseEvent, text: string) => void
}

export default class TemplateItem extends React.Component<TemplateItemProps, {}> {

    render() {
        return (
            <li className="template-item" onClick={(event) => {this.props.onPress(event, this.props.text)}}>
                {this.props.text}
            </li>
        )
    }
}