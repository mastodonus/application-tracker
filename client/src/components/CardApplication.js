import { useState } from 'react';
import Card from '@mui/material/Card';
import Typography  from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function CardApplication ({application, onEdit, onDelete}){
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const contextMenuOpen = Boolean(contextMenuAnchor);

    const openContextMenu = (event) => {
        setContextMenuAnchor(event.currentTarget);
    };
    const closeContextMenu = (action) => {
        if(action){
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
                <span>{application?.company}</span>
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
                        <MenuItem onClick={() => closeContextMenu(onEdit)}>
                            <EditIcon sx={{mr: '1rem'}} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => closeContextMenu(onDelete)}>
                            <DeleteIcon sx={{mr: '1rem'}} />
                            Delete
                        </MenuItem>
                    </Menu>
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
}

export default CardApplication