import { ExpoConfig, ConfigContext } from "expo/config";
import fs from "fs";
import path from "path";

interface TenantProfile {
  name: string;
  slug: string;
  bundleIdentifier: string;
  package: string;
  icon: string;
  splash: {
    image: string;
    backgroundColor: string;
  };
  defaultSchoolCode?: string;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const tenantKey = process.env.APP_TENANT || "default";
  const configPath = path.resolve(__dirname, "tenants.config.json");

  let tenant: TenantProfile = {
    name: "CodeNCampus",
    slug: "codencampus-app",
    bundleIdentifier: "com.codazk.codencampus",
    package: "com.codazk.codencampus",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      backgroundColor: "#FFFFFF",
    },
  };

  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const chosen = data[tenantKey] || data.default || tenant;
      tenant = {
        ...tenant,
        ...chosen,
        icon: fs.existsSync(path.resolve(__dirname, chosen.icon)) ? chosen.icon : tenant.icon,
        splash: {
          image: fs.existsSync(path.resolve(__dirname, chosen.splash?.image)) ? chosen.splash.image : tenant.splash.image,
          backgroundColor: chosen.splash?.backgroundColor || tenant.splash.backgroundColor,
        },
      };
    } catch {
      // Fallback to default tenant
    }
  }

  return {
    ...config,
    name: tenant.name,
    slug: tenant.slug,
    version: "1.0.0",
    sdkVersion: "58.0.0",
    orientation: "portrait",
    scheme: "codencampus",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: tenant.bundleIdentifier,
    },
    android: {
      package: tenant.package,
    },
    updates: {
      url: "https://u.expo.dev/26a63641-5fae-451a-83e7-19367d200e99",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    owner: "prince-up",
    extra: {
      tenantKey,
      defaultSchoolCode: tenant.defaultSchoolCode,
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
      eas: {
        projectId: "26a63641-5fae-451a-83e7-19367d200e99",
      },
    },
    plugins: ["expo-router"],
  };
};
