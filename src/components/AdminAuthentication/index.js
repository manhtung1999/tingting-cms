import { useLocation } from 'react-router-dom';
import { TOKEN_KEY, ADMIN_KEY } from '@/config/constant';
function AdminAuthentication(props) {
    const location = useLocation();
    const { pathname } = location;
    const { history } = props;

    // nếu đã đăng nhập mà vào page login hoặc '/' thì chuyển hướng sang màn overview.
    if (
        localStorage.getItem(TOKEN_KEY) &&
        localStorage.getItem(ADMIN_KEY) &&
        (pathname === '/' || pathname === '/login')
    ) {
        history.replace('/home/deposit');
        return '';
    }

    // chuyển hướng sang màn login nếu chưa đăng nhập mà truy cập vào các trang yêu cầu đăng nhập.
    // PROTECTED PAGE
    if (
        !localStorage.getItem(TOKEN_KEY) &&
        !(pathname === '/login') &&
        !(pathname === '/forgot-password') &&
        !(pathname === '/payment')
    ) {
        history.replace('/login');
        return '';
    }

    return props.children;
}

export default AdminAuthentication;
