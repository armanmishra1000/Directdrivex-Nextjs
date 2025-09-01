import { AdminFile, FileStats, FilePaginationState } from '@/types/admin';
import { mockFiles, mockFileStats } from '@/components/admin/files/data';

class FileManagementService {
  async getFiles(
    filters: any,
    sort: any,
    pagination: { page: number; pageSize: number }
  ): Promise<{ files: AdminFile[]; pagination: FilePaginationState }> {
    console.log("Fetching files with:", { filters, sort, pagination });
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = [...mockFiles];

    // Apply filtering
    if (filters.search) {
      filtered = filtered.filter(f => f.filename.toLowerCase().includes(filters.search.toLowerCase()) || f.owner.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.type !== 'all') {
      filtered = filtered.filter(f => f.type === filters.type);
    }
    // ... add other filters here

    // Apply sorting
    if (sort.key) {
      filtered.sort((a, b) => {
        const valA = a[sort.key];
        const valB = b[sort.key];
        if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const paginatedFiles = filtered.slice(startIndex, startIndex + pagination.pageSize);

    return {
      files: paginatedFiles,
      pagination: {
        currentPage: pagination.page,
        pageSize: pagination.pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async getStats(): Promise<FileStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFileStats;
  }
}

export const fileManagementService = new FileManagementService();