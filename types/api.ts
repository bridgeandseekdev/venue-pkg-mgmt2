import type { Package } from './models';

export type CreatePackageRequest = Omit<
  Package,
  '_id' | 'brandId' | 'createdAt' | 'updatedAt'
>;

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export type PackageResponse = ApiResponse<{
  packageId: string;
}>;
