import axios from 'axios';

import { API_GATEWAY_URL } from './config';

export interface SportCenter {
    id: string;
    name: string;
    phoneNumber: string;
    sportNames: string[];
    address: string;
    description: string;
    avatar: string;
    imageUrl: string;
}

export interface SportCentersResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: SportCenter[];
}

export const getSportCenters = async (): Promise<SportCentersResponse> => {
    try {
        const response = await axios.get<SportCentersResponse>(API_GATEWAY_URL + '/sport-centers');
        console.log('Sport centers:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching sport centers:', error);
        throw error;
    }
};