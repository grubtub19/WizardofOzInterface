import * as React from "react";
import TTS from './TTS';

type TTSInputProps = {
    text: string,
    handleChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
    gender: boolean
    genderCallback: (ev: React.MouseEvent) => void
}

export default class TTSInput extends React.Component<TTSInputProps> {
    myInput: React.RefObject<HTMLInputElement>;
    tts: React.RefObject<TTS>;

    constructor(props: any) {
        super(props);
        this.myInput = React.createRef<HTMLInputElement>()
        this.tts = React.createRef<TTS>();
        this.speak = this.speak.bind(this);
    }

    speak(e: any) {
        if (e.key === 'Enter') {
            this.tts.current.speak();
        }
    }

    render() {
        return (
        <div className="tts-input-container">
            <div className="tts-input">
                <input ref={this.myInput} type="text" value={this.props.text} onKeyDown={this.speak} onChange={this.props.handleChange}>
                    {this.props.children}
                </input>
            </div>
            <TTS ref={this.tts} text={this.props.text} gender={this.props.gender} genderCallback={this.props.genderCallback}/>
        </div>
        )
    }
}