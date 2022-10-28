import { useEffect, useState } from 'react';
import superagent from 'superagent';
import config from '@/config/index';
import { TOKEN_KEY } from '@/config/constant';
export const useUploadFile = file => {
    const [mediaResponse, setMediaResponse] = useState();

    useEffect(() => {
        if (file) {
            superagent
                .post(config.API_DOMAIN + 'api/v1/file/upload-image')
                .set('Authorization', 'Bearer ' + localStorage.getItem(TOKEN_KEY))
                .attach('file', file)
                .end((err, res) => {
                    if (res) {
                        setMediaResponse({ ...res.body.body });
                    }
                });
        }
    }, [file]);

    return [mediaResponse, setMediaResponse];
};
