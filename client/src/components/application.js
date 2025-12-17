import React from 'react'
import { GrStatusGoodSmall } from "react-icons/gr";

class Application extends React.Component{
    constructor(){
        super()
    }

    render(){
        const statusColorMap = {
            OPEN: 'blue',
            REJECTED: 'red',
            INTERVIEWING: 'lightgreen',
        };

        return <div className="application-card">
            <div className="application-card-section">
                <div className="info">
                    <h3>
                        {this.props.application?.company ?? ''}
                    </h3>
                    <span className="application-card-status">
                        <GrStatusGoodSmall
                            size="18"
                            color={statusColorMap[this.props.application?.status ?? 'OPEN']} />
                    </span>
                </div>
                <div className="application-card-information">
                    {!this.props.application?.link 
                        ? <span>{this.props.application?.title}</span>
                        : <a href={this.props.application?.link } target="_blank">{this.props.application?.title}</a>
                    }
                    <span className="info">
                        <span>
                            Position
                        </span>
                        <span>
                            {this.props.application?.position}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Location
                        </span>
                        <span>
                            {this.props.application?.site}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Salary Range
                        </span>
                        <span>
                            {this.props.application?.salary_min 
                                ? <span>{this.props.application?.salary_min}k - {this.props.application?.salary_max}k</span>
                                : <span>-</span>}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Applied
                        </span>
                        <span>
                            {(new Date(this.props.application?.applied)).toLocaleDateString()}
                        </span>
                    </span>
                </div>
                {!this.props.application?.description ? '' :
                    <p>{this.props.application?.description}</p>
                }
            </div>
        </div>
    }
}

export default Application