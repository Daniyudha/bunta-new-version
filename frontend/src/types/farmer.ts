export interface Farmer {
  id: string;
  name: string;
  group: string;
  chairman: string;
  members: string[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFarmerInput {
  name: string;
  group: string;
  chairman: string;
  members: string[];
  userId?: string;
}

export interface UpdateFarmerInput {
  name?: string;
  group?: string;
  chairman?: string;
  members?: string[];
  userId?: string;
}