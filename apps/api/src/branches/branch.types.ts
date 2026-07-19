export interface BranchView {
  id: string;
  code: string;
  name: string;
  address: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}
