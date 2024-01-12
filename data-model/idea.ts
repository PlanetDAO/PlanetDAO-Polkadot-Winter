export interface Idea {
  ideasId: number;
  Title: string;
  Description: string;
  wallet: string;
  user_id: number;
  logo?: string;
  allfiles: unknown;
  donation: number;
  votes: number;
  isVoted?:boolean;
  isOwner?:boolean;
}
