import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Logo({ variant, component, sx, logoSize }) {
    return (
        <Box className="logo" sx={{...sx, display: 'flex',  alignItems: 'center'}}>
            <Box
                component="img"
                src="/briefcase.png"
                alt="logo"
                sx={{
                    height: logoSize || '10rem',
                    width: 'auto',
                    objectFit: 'contain',
                }}
            />
            <Typography variant={variant ?? 'span'} component={component ?? 'span'}>
                Application
            </Typography>
            <Typography variant={variant ?? 'span'} component={component ?? 'span'} sx={{paddingLeft: '0.25rem'}}>
                Tracker
            </Typography>
        </Box>
    );
}

export default Logo;