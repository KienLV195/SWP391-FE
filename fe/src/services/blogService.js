import { MOCK_BLOGS } from './mockData';

/**
 * Blog Service - Handles all blog-related API calls
 *
 * NEW WORKFLOW:
 * - Doctor: Auto-publish all posts (Tài liệu, Tin tức, Thông báo)
 * - Manager: Auto-publish News and Announcements only (NOT Documents)
 * - Admin: Can only DELETE posts (no approval workflow)
 *
 * API Endpoints:
 * - GET /api/blogs - Get all public blogs (for Guest/Member pages)
 * - GET /api/blogs/author/{id} - Get blogs by author (for Doctor/Manager)
 * - POST /api/blogs - Create new blog (auto-publish)
 * - PUT /api/blogs/{id} - Update blog
 * - DELETE /api/blogs/{id} - Delete blog
 *
 * Admin Endpoints:
 * - GET /api/admin/blogs - Get all published blogs for monitoring
 * - DELETE /api/admin/blogs/{id} - Delete blog (only action allowed)
 */

class BlogService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    this.blogs = [...MOCK_BLOGS]; // Mock data for testing
  }

  // ===== PUBLIC BLOG METHODS (for Guest/Member pages) =====
  
  /**
   * Get public blogs for Guest/Member pages
   * API: GET /api/blogs?category={category}&contentType={contentType}&limit={limit}
   */
  async getPublicBlogs(filters = {}) {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const queryParams = new URLSearchParams();
      // if (filters.category) queryParams.append('category', filters.category);
      // if (filters.contentType) queryParams.append('contentType', filters.contentType);
      // if (filters.limit) queryParams.append('limit', filters.limit);
      //
      // const response = await fetch(`${this.baseURL}/blogs?${queryParams}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return { success: true, data: data.blogs, message: 'Blogs retrieved successfully' };
      // } else {
      //   return { success: false, error: data.message, message: 'Failed to retrieve blogs' };
      // }

      // MOCK_DATA: Remove this section when implementing real API
      await this.simulateDelay();
      let filteredBlogs = this.blogs.filter(blog =>
        blog.status === 'published' &&
        blog.targetAudience === 'public'
      );

      // Apply filters
      if (filters.category) {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === filters.category);
      }
      
      if (filters.contentType) {
        filteredBlogs = filteredBlogs.filter(blog => blog.contentType === filters.contentType);
      }

      // Sort by published date (newest first)
      filteredBlogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      // Apply limit
      if (filters.limit) {
        filteredBlogs = filteredBlogs.slice(0, filters.limit);
      }

      return {
        success: true,
        data: filteredBlogs,
        message: 'Blogs retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve blogs'
      };
    }
  }

  /**
   * Get blog by slug for public viewing
   * API: GET /api/blogs/slug/{slug}
   */
  async getBlogBySlug(slug) {
    try {
      await this.simulateDelay();
      
      const blog = this.blogs.find(blog => 
        blog.slug === slug && 
        blog.status === 'published' && 
        blog.targetAudience === 'public'
      );

      if (!blog) {
        return {
          success: false,
          error: 'Blog not found',
          message: 'Blog not found or not published'
        };
      }

      // Increment view count
      blog.views += 1;

      return {
        success: true,
        data: blog,
        message: 'Blog retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve blog'
      };
    }
  }

  // ===== AUTHOR BLOG METHODS (for Doctor/Manager) =====

  /**
   * Get blogs by author
   * API: GET /api/blogs/author/{authorId}?status={status}&category={category}
   */
  async getBlogsByAuthor(authorId, filters = {}) {
    try {
      await this.simulateDelay();
      
      let authorBlogs = this.blogs.filter(blog => blog.authorId === authorId);

      // Apply filters
      if (filters.status) {
        authorBlogs = authorBlogs.filter(blog => blog.status === filters.status);
      }
      
      if (filters.category) {
        authorBlogs = authorBlogs.filter(blog => blog.category === filters.category);
      }

      // Sort by created date (newest first)
      authorBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        data: authorBlogs,
        message: 'Author blogs retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve author blogs'
      };
    }
  }

  /**
   * Create new blog - Auto-publish for Doctor/Manager
   * API: POST /api/blogs
   */
  async createBlog(blogData, authorId, authorRole) {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/blogs`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({
      //     ...blogData,
      //     authorId,
      //     authorRole
      //   })
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return { success: true, data: data.blog, message: 'Blog created and published successfully' };
      // } else {
      //   return { success: false, error: data.message, message: 'Failed to create blog' };
      // }

      // MOCK_DATA: Remove this section when implementing real API
      await this.simulateDelay();

      // Validate content type permissions
      if (authorRole === 'manager' && blogData.contentType === 'document') {
        return {
          success: false,
          error: 'Permission denied',
          message: 'Manager không được phép đăng Tài liệu. Chỉ có thể đăng Tin tức và Thông báo.'
        };
      }

      const now = new Date().toISOString();
      const newBlog = {
        id: Math.max(...this.blogs.map(b => b.id)) + 1,
        ...blogData,
        authorId,
        authorRole,
        slug: this.generateSlug(blogData.title),
        status: 'published', // Auto-publish for Doctor/Manager
        views: 0,
        likes: 0,
        createdAt: now,
        updatedAt: now,
        publishedAt: now // Auto-publish immediately
      };

      this.blogs.push(newBlog);

      return {
        success: true,
        data: newBlog,
        message: 'Blog created and published successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create blog'
      };
    }
  }

  /**
   * Update blog
   * API: PUT /api/blogs/{id}
   */
  async updateBlog(blogId, blogData) {
    try {
      await this.simulateDelay();
      
      const blogIndex = this.blogs.findIndex(blog => blog.id === blogId);
      if (blogIndex === -1) {
        return {
          success: false,
          error: 'Blog not found',
          message: 'Blog not found'
        };
      }

      const updatedBlog = {
        ...this.blogs[blogIndex],
        ...blogData,
        updatedAt: new Date().toISOString(),
        publishedAt: blogData.status === 'published' && !this.blogs[blogIndex].publishedAt 
          ? new Date().toISOString() 
          : this.blogs[blogIndex].publishedAt
      };

      this.blogs[blogIndex] = updatedBlog;

      return {
        success: true,
        data: updatedBlog,
        message: 'Blog updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update blog'
      };
    }
  }

  /**
   * Delete blog
   * API: DELETE /api/blogs/{id}
   */
  async deleteBlog(blogId) {
    try {
      await this.simulateDelay();
      
      const blogIndex = this.blogs.findIndex(blog => blog.id === blogId);
      if (blogIndex === -1) {
        return {
          success: false,
          error: 'Blog not found',
          message: 'Blog not found'
        };
      }

      this.blogs.splice(blogIndex, 1);

      return {
        success: true,
        message: 'Blog deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete blog'
      };
    }
  }

  // ===== ADMIN BLOG METHODS =====

  /**
   * Get all published blogs for admin monitoring (no approval needed)
   * API: GET /api/admin/blogs?category={category}&search={search}
   */
  async getAllBlogsForAdmin(filters = {}) {
    try {
      await this.simulateDelay();

      // Admin only sees published blogs (no approval workflow)
      let allBlogs = this.blogs.filter(blog => blog.status === 'published');

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        allBlogs = allBlogs.filter(blog => blog.category === filters.category);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        allBlogs = allBlogs.filter(blog =>
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.author.toLowerCase().includes(searchTerm) ||
          blog.excerpt.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by published date (newest first)
      allBlogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      return {
        success: true,
        data: allBlogs,
        message: 'All published blogs retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve blogs'
      };
    }
  }

  // ===== UTILITY METHODS =====

  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }

  async simulateDelay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
const blogService = new BlogService();
export default blogService;
