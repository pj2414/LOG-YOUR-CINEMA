export const API_BASE_URL = 'http://localhost:5000/api'; // Update with your actual API base URL

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(credentials: { username: string; email: string; password: string }) {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // Movie endpoints
  async searchMovies(query: string, page = 1) {
    return this.request<any>(`/movies/search/${encodeURIComponent(query)}?page=${page}`);
  }

  async getMovie(movieId: string) {
    return this.request<any>(`/movies/${movieId}`);
  }

  async getTrendingMovies() {
    return this.request<any>('/trending/movies');
  }

  // Anime endpoints
  async searchAnime(query: string, page = 1) {
    return this.request<any>(`/anime/search/${encodeURIComponent(query)}?page=${page}`);
  }

  async getAnime(animeId: string) {
    return this.request<any>(`/anime/${animeId}`);
  }

  async getTrendingAnime() {
    return this.request<any>('/trending/anime');
  }

  // Log endpoints
  async createLog(logData: any) {
    return this.request<any>('/logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getLogs(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/logs?${queryString}`);
  }

  async getLog(contentType: string, contentId: string) {
    return this.request<any>(`/logs/${contentType}/${contentId}`);
  }

  async deleteLog(logId: string) {
    return this.request<any>(`/logs/${logId}`, {
      method: 'DELETE',
    });
  }

  // Watchlist endpoints
  async addToWatchlist(item: any) {
    return this.request<any>('/watchlist', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async getWatchlist(params: any = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<any>(`/watchlist?${queryString}`);
  }

  async removeFromWatchlist(watchlistId: string) {
    return this.request<any>(`/watchlist/${watchlistId}`, {
      method: 'DELETE',
    });
  }

  // Feed endpoints
  async getFeed(page = 1, limit = 20) {
    return this.request<any>(`/feed?page=${page}&limit=${limit}`);
  }

  async getFriendsWatching() {
    return this.request<any>('/friends/watching');
  }

  async getFriendsRecent(page = 1, limit = 20) {
    return this.request<any>(`/friends/recent?page=${page}&limit=${limit}`);
  }

  // User endpoints
  async getUserProfile(userId: string) {
    return this.request<any>(`/users/${userId}`);
  }

  async getUserFollowers(userId: string) {
    return this.request<any>(`/users/${userId}/followers`);
  }

  async getUserFollowing(userId: string) {
    return this.request<any>(`/users/${userId}/following`);
  }

  async updateProfile(profileData: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async followUser(userId: string) {
    return this.request<any>(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string) {
    return this.request<any>(`/users/${userId}/follow`, {
      method: 'DELETE',
    });
  }

  async searchUsers(query: string) {
    return this.request<any>(`/users/search/${encodeURIComponent(query)}`);
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request<any>('/admin/users');
  }

  async deleteUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAppStats() {
    return this.request<any>('/admin/stats');
  }

  // Collection endpoints
  async createCollection(collectionData: any) {
    return this.request<any>('/collections', {
      method: 'POST',
      body: JSON.stringify(collectionData),
    });
  }

  async getCollections() {
    return this.request<any>('/collections');
  }

  async addToCollection(collectionId: string, item: any) {
    return this.request<any>(`/collections/${collectionId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeFromCollection(collectionId: string, item: any) {
    return this.request<any>(`/collections/${collectionId}/items`, {
      method: 'DELETE',
      body: JSON.stringify(item),
    });
  }

  // Diary endpoints
  async createDiaryEntry(entryData: any) {
    return this.request<any>('/diary', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async getDiaryEntries(page = 1, limit = 20) {
    return this.request<any>(`/diary?page=${page}&limit=${limit}`);
  }

  async updateDiaryEntry(diaryId: string, entryData: any) {
    return this.request<any>(`/diary/${diaryId}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteDiaryEntry(diaryId: string) {
    return this.request<any>(`/diary/${diaryId}`, {
      method: 'DELETE',
    });
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient(API_BASE_URL);
