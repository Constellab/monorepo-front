import { DcEnvironmentHelper } from '../dc-environment.helper';

export interface DcHttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export class DcHttpService {
  private readonly appId: string;
  private readonly userAccessToken: string;

  constructor(appId: string, userAccessToken: string) {
    this.appId = appId;
    this.userAccessToken = userAccessToken;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const baseUrl = DcEnvironmentHelper.getCoreApiUrl();
    const url = new URL(endpoint, baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options?: DcHttpOptions,
    body?: unknown
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);

    const fetchOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        gws_app_id: this.appId,
        gws_user_access_token: this.userAccessToken,
        ...options?.headers,
      },
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: DcHttpOptions): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, body?: unknown, options?: DcHttpOptions): Promise<T> {
    return this.request<T>('POST', endpoint, options, body);
  }

  async put<T>(endpoint: string, body?: unknown, options?: DcHttpOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, options, body);
  }

  async patch<T>(endpoint: string, body?: unknown, options?: DcHttpOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, options, body);
  }

  async delete<T>(endpoint: string, options?: DcHttpOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}
