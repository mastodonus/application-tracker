import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function Application ({application, onEdit}){
    const statusColorMap = {
        OPEN: 'application-status-open',
        REJECTED: 'application-status-rejected',
        INTERVIEWING: 'application-status-interviewing',
    };

    return (
        <div className="application-card">
            <div className="application-card-section ">
                <div className={`info application-card-header ${statusColorMap[application?.status ?? 'OPEN']}`}>
                    <h3>
                        {application?.company ?? ''}
                    </h3>
                    <span className="application-card-status">
                        <IconButton onClick={onEdit}>
                            <EditIcon />
                        </IconButton>
                    </span>
                </div>
                <div className="application-card-information">
                    {!application?.link 
                        ? <span>{application?.title}</span>
                        : <a href={application?.link } target="_blank">{application?.title}</a>
                    }
                    <span className="info">
                        <span>
                            Position
                        </span>
                        <span>
                            {application?.position}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Location
                        </span>
                        <span>
                            {application?.site}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Salary Range
                        </span>
                        <span>
                            {application?.salaryMin 
                                ? <span>{application?.salaryMin}k - {application?.salaryMax}k</span>
                                : <span>-</span>}
                        </span>
                    </span>
                    <span className="info">
                        <span>
                            Applied
                        </span>
                        <span>
                            {(new Date(application?.applied)).toLocaleDateString()}
                        </span>
                    </span>
                    {!application?.description ? '' :
                        <p>{application?.description}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Application