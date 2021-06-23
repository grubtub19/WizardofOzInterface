import * as React from "react";
import * as templates from "../Script 2.0.json";
import TemplateItem from "./TemplateItem";

type TemplateListProps = {
    onPress: (ev: React.MouseEvent, text: string) => void
}

class TemplateList extends React.Component<TemplateListProps> {

    Tabs: React.RefObject<HTMLUListElement>;

    constructor(props: any) {
        super(props);
        this.Tabs = React.createRef<HTMLUListElement>();
        
        
    }

    componentDidMount() {
        M.Tabs.init(this.Tabs.current);
    }

    render() {
        return (
            // <div>
            //     <ul className="tabs" ref={this.Tabs}>
            //         <li className="tab col s3"><a href="#test-swipe-1">Test 1</a></li>
            //         <li className="tab col s3"><a href="#test-swipe-2">Test 2</a></li>
            //         <li className="tab col s3"><a href="#test-swipe-3">Test 3</a></li>
            //     </ul>
            //     <div id="test-swipe-1" className="col s12 blue">Test 1</div>
            //     <div id="test-swipe-2" className="col s12 red">Test 2</div>
            //     <div id="test-swipe-3" className="col s12 green">Test 3</div>
            // </div>

        <div className="template-container">
                <ul ref={this.Tabs} className="tabs">
            
                {templates.Sheet1.Phases.map((phase, index)=>{
                    return (
                    
                        <li className="tab col s3"><a href={"#page" + index}>{phase.PhaseName}</a></li>
                    
                    )
                })}

                </ul>
            {templates.Sheet1.Phases.map((phase, index)=>{
                return (
                <div id={"page" + index} className="col s12">
                    {<ul className="collapsible popout">
                    {phase.SubCategories.map((subcategory) => {
                        return (
                            
                                <li>
                                    <div className="collapsible-header"><i className="material-icons">filter_drama</i>{subcategory.SubName}</div>
                                    <div className="collapsible-body">
                                        <ul className="template-list colapsible popout">

                                            {subcategory.Templates.map((template) => {
                                                return <TemplateItem text={template.Item} onPress={this.props.onPress}/>
                                            })}

                                        </ul>
                                    </div>
                                </li>
                            
                        )
                    })}

                    </ul>}
                </div>
                )
            })}
                        
        
        </div>
        );
    }
}
export default TemplateList;