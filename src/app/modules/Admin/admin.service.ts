import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";

import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHelper";

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  //console.dir(andConditions, { depth: 'infinity' })
  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdmin = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.delete({
      where: {
        id,
      },
    });

    await tx.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};
const softDeleteAdmin = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const AdminService = {
  getAllFromDB,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
