//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v14.2.0.0 (NJsonSchema v11.1.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

import { API_CHAT_URL } from "./config";

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

export class Client {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl ?? API_CHAT_URL;
    }

    /**
     * @return OK
     */
    sendMessage(chatSessionId: string, body: SendMessageRequest): Promise<void> {
        let url_ = this.baseUrl + "/api/chats/{chatSessionId}/messages";
        if (chatSessionId === undefined || chatSessionId === null)
            throw new Error("The parameter 'chatSessionId' must be defined.");
        url_ = url_.replace("{chatSessionId}", encodeURIComponent("" + chatSessionId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processSendMessage(_response);
        });
    }

    protected processSendMessage(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }

    /**
     * @param page (optional) 
     * @param limit (optional) 
     * @return OK
     */
    getChatMessages(chatSessionId: string, page: number | undefined, limit: number | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/chats/{chatSessionId}/messages?";
        if (chatSessionId === undefined || chatSessionId === null)
            throw new Error("The parameter 'chatSessionId' must be defined.");
        url_ = url_.replace("{chatSessionId}", encodeURIComponent("" + chatSessionId));
        if (page === null)
            throw new Error("The parameter 'page' cannot be null.");
        else if (page !== undefined)
            url_ += "page=" + encodeURIComponent("" + page) + "&";
        if (limit === null)
            throw new Error("The parameter 'limit' cannot be null.");
        else if (limit !== undefined)
            url_ += "limit=" + encodeURIComponent("" + limit) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetChatMessages(_response);
        });
    }

    protected processGetChatMessages(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }

    /**
     * @return OK
     */
    markMessageAsRead(chatSessionId: string, messageId: string): Promise<void> {
        let url_ = this.baseUrl + "/api/chats/{chatSessionId}/messages/{messageId}/read";
        if (chatSessionId === undefined || chatSessionId === null)
            throw new Error("The parameter 'chatSessionId' must be defined.");
        url_ = url_.replace("{chatSessionId}", encodeURIComponent("" + chatSessionId));
        if (messageId === undefined || messageId === null)
            throw new Error("The parameter 'messageId' must be defined.");
        url_ = url_.replace("{messageId}", encodeURIComponent("" + messageId));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "POST",
            headers: {
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processMarkMessageAsRead(_response);
        });
    }

    protected processMarkMessageAsRead(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }

    /**
     * @param page (optional) 
     * @param limit (optional) 
     * @return OK
     */
    getChatSessions(page: number | undefined, limit: number | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/chats?";
        if (page === null)
            throw new Error("The parameter 'page' cannot be null.");
        else if (page !== undefined)
            url_ += "page=" + encodeURIComponent("" + page) + "&";
        if (limit === null)
            throw new Error("The parameter 'limit' cannot be null.");
        else if (limit !== undefined)
            url_ += "limit=" + encodeURIComponent("" + limit) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetChatSessions(_response);
        });
    }

    protected processGetChatSessions(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }

    /**
     * @return OK
     */
    createChatSession(body: CreateChatSessionRequest): Promise<void> {
        let url_ = this.baseUrl + "/api/chats";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processCreateChatSession(_response);
        });
    }

    protected processCreateChatSession(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }

    /**
     * @return OK
     */
    editMessage(chatSessionId: string, messageId: string, body: EditMessageRequest): Promise<void> {
        let url_ = this.baseUrl + "/api/chats/{chatSessionId}/messages/{messageId}";
        if (chatSessionId === undefined || chatSessionId === null)
            throw new Error("The parameter 'chatSessionId' must be defined.");
        url_ = url_.replace("{chatSessionId}", encodeURIComponent("" + chatSessionId));
        if (messageId === undefined || messageId === null)
            throw new Error("The parameter 'messageId' must be defined.");
        url_ = url_.replace("{messageId}", encodeURIComponent("" + messageId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processEditMessage(_response);
        });
    }

    protected processEditMessage(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(null as any);
    }
}

export class CreateChatSessionRequest implements ICreateChatSessionRequest {
    user1Id?: string;
    user2Id?: string;

    constructor(data?: ICreateChatSessionRequest) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.user1Id = _data["user1Id"];
            this.user2Id = _data["user2Id"];
        }
    }

    static fromJS(data: any): CreateChatSessionRequest {
        data = typeof data === 'object' ? data : {};
        let result = new CreateChatSessionRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["user1Id"] = this.user1Id;
        data["user2Id"] = this.user2Id;
        return data;
    }
}

export interface ICreateChatSessionRequest {
    user1Id?: string;
    user2Id?: string;
}

export class EditMessageRequest implements IEditMessageRequest {
    messageText?: string | undefined;

    constructor(data?: IEditMessageRequest) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.messageText = _data["messageText"];
        }
    }

    static fromJS(data: any): EditMessageRequest {
        data = typeof data === 'object' ? data : {};
        let result = new EditMessageRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["messageText"] = this.messageText;
        return data;
    }
}

export interface IEditMessageRequest {
    messageText?: string | undefined;
}

export class SendMessageRequest implements ISendMessageRequest {
    messageText?: string | undefined;

    constructor(data?: ISendMessageRequest) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.messageText = _data["messageText"];
        }
    }

    static fromJS(data: any): SendMessageRequest {
        data = typeof data === 'object' ? data : {};
        let result = new SendMessageRequest();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["messageText"] = this.messageText;
        return data;
    }
}

export interface ISendMessageRequest {
    messageText?: string | undefined;
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}