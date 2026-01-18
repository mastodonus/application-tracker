import { useState } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function CardApplication({ application, onEdit, onDelete, onEditDocuments, onEditInterviews }) {
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const contextMenuOpen = Boolean(contextMenuAnchor);

    const openContextMenu = (event) => {
        setContextMenuAnchor(event.currentTarget);
    };
    const closeContextMenu = (action) => {
        if (action) {
            action();
        }
        setContextMenuAnchor(null);
    };

    const statusColorMap = {
        OPEN: 'application-status-open',
        REJECTED: 'application-status-rejected',
        INTERVIEWING: 'application-status-interviewing',
    };

    return (
        <Card key={application.applicationId} className="application-card">
            <Typography variant="h6" component="div" className={`info application-card-header ${statusColorMap[application?.status ?? 'OPEN']}`}>
                <span>
                    {application?.company}
                </span>
                <span className="application-card-status">
                    <IconButton
                        id="basic-button"
                        aria-controls={contextMenuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={contextMenuOpen ? 'true' : undefined}
                        onClick={(e) => openContextMenu(e)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={contextMenuAnchor}
                        open={contextMenuOpen}
                        onClose={() => closeContextMenu()}
                        slotProps={{
                            list: {
                                'aria-labelledby': 'basic-button',
                            },
                        }}
                    >

                        {application?.link && (
                            <MenuItem onClick={() => window.open(application.link, '_blank')}>
                                <LaunchIcon sx={{ mr: '1rem' }} />
                                Open Job
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => closeContextMenu(onEdit)}>
                            <EditIcon sx={{ mr: '1rem' }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => closeContextMenu(onDelete)}>
                            <DeleteIcon sx={{ mr: '1rem' }} />
                            Delete
                        </MenuItem>
                        <MenuItem onClick={() => closeContextMenu(onEditDocuments)}>
                            <InsertDriveFileIcon sx={{ mr: '1rem' }} />
                            Documents
                        </MenuItem>
                        <MenuItem onClick={() => closeContextMenu(onEditInterviews)}>
                            <VideoCameraFrontIcon sx={{ mr: '1rem' }} />
                            Interviews
                        </MenuItem>
                    </Menu>
                </span>
            </Typography>
            <Typography variant="h7" component="div">
            </Typography>
            <Typography variant="body2" color="text.secondary" className="application-card-content">
                <h3>{application?.title}</h3>
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
}

export default CardApplication