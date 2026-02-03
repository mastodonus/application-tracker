import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Logo({ variant, component, sx }) {
    return (
        <Box className="logo" sx={{...sx, display: 'flex', flexWrap: 'wrap'}}>
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