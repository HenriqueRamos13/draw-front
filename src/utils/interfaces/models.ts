export type Report = {
  id: string;
  description: string;
  type: ReportType;
  user_id: string;
  image_id: string;
  image?: Image;
  user?: User;
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
};

export type Vote = {
  id: string;
  vote: boolean;
  user_id: string;
  image_id: string;
  image?: Image;
  user?: User;
  created_at: Date;
  updated_at: Date;
};

export type Challenge = {
  id: string;
  title: string;
  description: string | null;
  adult: boolean;
  status: ChallengeStatus;
  starts_in: Date;
  ends_in: Date;
  votes: number;
  user_id: string;
  user?: User;
  images?: Image[];
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
};

export type Image = {
  id: string;
  file_name: string;
  url: string;
  small_file_name: string;
  small_url: string;
  blocked: boolean;
  type: ImageType;
  total_votes: number;
  user_id: string;
  user?: User;
  challenge_id: string | null;
  challenge?: Challenge | null;
  votes?: Vote[];
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
};

export type User = {
  id: string;
  email: string;
  password: string;
  username: string;
  points: number;
  roles: Role;
  created_at: Date;
  images?: Image[] | null;
  updatedAt: Date;
  deleted: boolean;
};

export enum ReportType {
  SensibleContent = "SensibleContent",
  Other = "Other",
}

export enum ChallengeStatus {
  Pending = "Pending",
  Started = "Started",
  Finished = "Finished",
}

export enum ImageType {
  Profile = "Profile",
  Art = "Art",
}

export enum Role {
  Admin = "Admin",
  User = "User",
}
