export interface ReduxUser {
  username: string; //this is the email
  given_name: string;
  family_name: string;
  sessionLoginTime?: string;
}
const INIT = 'default state';
export const reduxUser: ReduxUser = {
  username: INIT,
  family_name: INIT,
  given_name: INIT,
  sessionLoginTime: new Date().toISOString(),
};
