export interface ProjectWithRole {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  role: string; // The role of the requesting user in this project
}
