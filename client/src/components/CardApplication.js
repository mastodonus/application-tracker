import Card from '@mui/material/Card';
import Typography  from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CardApplication ({application, onEdit, onDelete}){
    const statusColorMap = {
        OPEN: 'application-status-open',
        REJECTED: 'application-status-rejected',
        INTERVIEWING: 'application-status-interviewing',
    };

    return (
        <Card key={application.applicationId} className="application-card">
            <Typography variant="h6" component="div" className={`info application-card-header ${statusColorMap[application?.status ?? 'OPEN']}`}>
                <span>{application?.company}</span>
                <span className="application-card-status">
                    <IconButton onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </Typography>
            <Typography variant="body2" color="text.secondary" className="application-card-content">
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
            </Typography>
        </Card>
    )

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

export default CardApplication