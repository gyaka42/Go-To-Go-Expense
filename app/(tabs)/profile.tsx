import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { ThemeColors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const accountOptions: accountOptionType[] = [
    {
      key: "editProfile",
      titleKey: "profile.options.editProfile",
      icon: <Icons.UserIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      key: "settings",
      titleKey: "profile.options.settings",
      icon: <Icons.GearSixIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/settingsModal",
      bgColor: "#059669",
    },
    {
      key: "privacy",
      titleKey: "profile.options.privacyPolicy",
      icon: <Icons.LockIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/privacyPolicyModal",
      bgColor: colors.neutral600,
    },
    {
      key: "logout",
      titleKey: "profile.options.logout",
      icon: <Icons.SignOutIcon size={26} color={colors.white} weight="fill" />,
      //routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  };

  const showLogoutAlert = () => {
    Alert.alert(
      t("common.confirmation"),
      t("profile.logout.confirmationMessage"),
      [
        {
          text: t("common.cancel"),
          onPress: () => console.log("Annuleer uitloggen"),
          style: "cancel",
        },
        {
          text: t("profile.logout.confirm"),
          onPress: () => handleLogout(),
          style: "destructive",
        },
      ]
    );
  };

  const handlePress = (item: accountOptionType) => {
    if (item.key === "logout") {
      showLogoutAlert();
    }

    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.contiainer}>
        {/* header  */}
        <Header
          title={t("profile.title")}
          style={{ marginVertical: spacingY._10 }}
        />

        {/* user information */}
        <View style={[styles.sectionCard, styles.userInfo]}>
          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            {/* User image */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* Name and email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.text}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account opties */}
        <View style={[styles.sectionCard, styles.accountOptions]}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                key={index.toString()}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(36)}
                style={[
                  styles.listItem,
                  index === accountOptions.length - 1 && styles.lastListItem,
                ]}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {t(item.titleKey)}
                  </Typo>
                  <Icons.CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.neutral400}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    contiainer: {
      flex: 1,
      paddingHorizontal: spacingX._20,
    },
    userInfo: {
      marginTop: verticalScale(30),
      alignItems: "center",
      gap: spacingY._15,
    },
    avatarContainer: {
      position: "relative",
      alignSelf: "center",
    },
    avatar: {
      alignSelf: "center",
      backgroundColor: colors.cardBackground,
      height: verticalScale(135),
      width: verticalScale(135),
      borderRadius: 200,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    nameContainer: {
      gap: verticalScale(4),
      alignItems: "center",
    },
    listIcon: {
      height: verticalScale(44),
      width: verticalScale(44),
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius._15,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    listItem: {
      marginBottom: verticalScale(17),
    },
    lastListItem: {
      marginBottom: 0,
    },
    accountOptions: {
      marginTop: spacingY._35,
    },
    flexRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacingX._10,
    },
    sectionCard: {
      backgroundColor: colors.cardBackground,
      padding: spacingX._20,
      borderRadius: radius._15,
      borderCurve: "continuous",
      borderWidth: 1,
      borderColor: colors.borderColor,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: verticalScale(4) },
      shadowOpacity: 0.1,
      shadowRadius: scale(12),
      elevation: 3,
    },
  });
