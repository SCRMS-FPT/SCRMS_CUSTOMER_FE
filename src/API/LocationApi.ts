// Interfaces para los tipos de datos de ubicación
export interface LocationItem {
    id: string;
    name: string;
    name_en: string;
    full_name: string;
    full_name_en: string;
    latitude: string;
    longitude: string;
}

export interface LocationApiResponse {
    error: number;
    error_text: string;
    data_name: string;
    data: LocationItem[];
}

/**
 * Servicio para obtener datos de ubicaciones geográficas de Vietnam 
 */
export class LocationApi {
    /**
     * Método privado para realizar las peticiones a la API
     * @param type Tipo de consulta (1: provincias, 2: distritos, 3: comunas, etc.)
     * @param id ID del elemento padre (0 para provincias, id de provincia para distritos, etc.)
     */
    private static async fetchLocation(type: number, id: string = "0"): Promise<LocationApiResponse> {
        try {
            const response = await fetch(`https://esgoo.net/api-tinhthanh/${type}/${id}.htm`);
            if (!response.ok) {
                throw new Error(`Lỗi khi lấy dữ liệu địa điểm: ${response.statusText}`);
            }
            return await response.json() as LocationApiResponse;
        } catch (error) {
            console.error("Lỗi truy vấn API địa điểm:", error);
            throw error;
        }
    }

    /**
     * Obtener lista de provincias/ciudades de Vietnam
     */
    public static async getProvinces(): Promise<LocationItem[]> {
        const response = await this.fetchLocation(1);
        return response.data || [];
    }

    /**
     * Obtener lista de distritos según la provincia/ciudad seleccionada
     * @param provinceId ID de la provincia/ciudad
     */
    public static async getDistricts(provinceId: string): Promise<LocationItem[]> {
        if (!provinceId) return [];
        const response = await this.fetchLocation(2, provinceId);
        return response.data || [];
    }

    /**
     * Obtener lista de comunas/barrios según el distrito seleccionado
     * @param districtId ID del distrito
     */
    public static async getCommunes(districtId: string): Promise<LocationItem[]> {
        if (!districtId) return [];
        const response = await this.fetchLocation(3, districtId);
        return response.data || [];
    }

    /**
     * Obtener todos los datos de ubicación (provincias, distritos, comunas)
     */
    public static async getAllLocationData(): Promise<LocationApiResponse> {
        return await this.fetchLocation(4);
    }

    /**
     * Obtener información detallada de una ubicación específica por su ID
     * @param locationId ID de la ubicación
     */
    public static async getLocationInfo(locationId: string): Promise<LocationApiResponse> {
        if (!locationId) throw new Error("ID de ubicación es requerido");
        return await this.fetchLocation(5, locationId);
    }
}