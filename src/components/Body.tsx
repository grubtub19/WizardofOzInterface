import * as React from "react";
import TemplateList from './List';
import TTSInput from './TTSInput';

type bodyState = {
    textValue: string
    gender: boolean
}

export default class Body extends React.Component<{}, bodyState> {
    ttsInput: React.RefObject<TTSInput>;

    constructor(props: any) {
        super(props);
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {accordion: true});
        });
        this.state = {
            textValue: 'Empty',
            gender: false
        }
        this.ttsInput = React.createRef<TTSInput>();

        this.handleChange = this.handleChange.bind(this);
        this.genderCallback = this.genderCallback.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    onPress(event: React.MouseEvent, text: string) {
        this.setState({
            textValue: text
        })
        this.ttsInput.current.myInput.current.focus();
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            textValue: event.target.value
        })
    }

    genderCallback(ev: React.MouseEvent) {
        this.setState({ gender: !this.state.gender });
    }

    render() { 
        return (
        <div className="main_page">
            <TemplateList onPress={this.onPress}/>
            <TTSInput ref={this.ttsInput} text={this.state.textValue} handleChange={this.handleChange} gender={this.state.gender} 
            genderCallback={this.genderCallback}></TTSInput>
        </div>
        );
    }
}