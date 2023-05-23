import SuperTokens from 'supertokens-auth-react';
import ThirdParty, { Google } from 'supertokens-auth-react/recipe/thirdparty';
import Session from 'supertokens-auth-react/recipe/session';
import { getBase } from '../../urls';

export default function SuperTokensMain() {
	SuperTokens.init({
		appInfo: {
			appName: 'density-admin',
			apiDomain: getBase().apiUrl,
			websiteDomain: getBase().appUrl,
			apiBasePath: '/admin/auth',
			websiteBasePath: '/admin/auth',
		},
		recipeList: [
			ThirdParty.init({
				style: `[data-supertokens~=container] {
          font-family: cursive;
          --palette-background: 51, 51, 51;
          --palette-inputBackground: 41, 41, 41;
          --palette-inputBorder: 41, 41, 41;
          --palette-textTitle: 255, 255, 255;
          --palette-textLabel: 255, 255, 255;
          --palette-textPrimary: 255, 255, 255;
          --palette-error: 173, 46, 46;
          --palette-textInput: 169, 169, 169;
          --palette-textLink: 169, 169, 169;
        }`,
				signInAndUpFeature: {
					providers: [Google.init()],
				},
				onHandleEvent: (ctx) => {
					if (ctx.action === 'SESSION_ALREADY_EXISTS') console.log('Already exists');
					else if (ctx.action === 'SUCCESS') console.log('Success');
				},
				getRedirectionURL: async (ctx) => {
					if (ctx.action === 'SUCCESS') {
						return '/dashboard';
					}
				},
			}),
			Session.init(),
		],
	});
}
