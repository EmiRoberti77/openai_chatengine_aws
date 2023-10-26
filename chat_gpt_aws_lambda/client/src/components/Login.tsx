import { Authenticator } from '@aws-amplify/ui-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../state/features/UserSlice';
interface LoginProps {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLogged }) => {
  const dispatch = useDispatch();
  const cardStyle: React.CSSProperties = {
    width: '300px',
    padding: '20px',
    margin: '50px auto',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  return (
    <div style={cardStyle}>
      <div>Emi Open AI login</div>

      <Authenticator
        initialState="signIn"
        components={{
          SignUp: {
            FormFields() {
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  {/* Custom fields for name, family_name */}
                  <div style={labelStyle}>
                    <label>First name</label>
                  </div>
                  <input
                    style={inputStyle}
                    type="text"
                    name="given_name"
                    placeholder="Please enter your first name"
                  />
                  <div style={labelStyle}>
                    <label>Last name</label>
                  </div>
                  <input
                    style={inputStyle}
                    type="text"
                    name="family_name"
                    placeholder="Please enter your last name"
                  />
                  <div style={labelStyle}>
                    <label>Phone number</label>
                  </div>
                  <input
                    style={inputStyle}
                    type="text"
                    name="phone_number"
                    placeholder="Please enter a valid mobile"
                  />
                </>
              );
            },
          },
        }}
        services={{
          async validateCustomSignUp(formData: any): Promise<any> {
            if (!formData.given_name) {
              return {
                name: 'First Name is required',
              };
            }
            if (!formData.family_name) {
              return {
                family_name: 'Last Name is required',
              };
            }
            if (!formData.phone_number) {
              return {
                phone_number: 'Phone_number is required',
              };
            }
          },
        }}
      >
        {({ signOut, user }) => {
          if (user) {
            setIsLogged(true); //
            console.log('user', user.attributes?.email);
            dispatch(
              setUser({
                username: user.attributes?.email || 'no user',
                given_name: user.attributes?.given_name || 'no user',
                family_name: user.attributes?.family_name || 'no user',
                sessionLoginTime: new Date().toISOString(),
              })
            );
          }
          return <></>; // return empty JSX element to satisfy call back
        }}
      </Authenticator>
    </div>
  );
};

export default Login;
