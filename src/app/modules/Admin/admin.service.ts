import { Admin, Prisma } from "@prisma/client";
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

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAdmin = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
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

export const AdminService = {
  getAllFromDB,
  getAdminById,
  updateAdmin,
};
