import { useTheme } from "@/contexts/themeContext";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

const Loading = ({ size = "large" }: ActivityIndicatorProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={size} color={colors.primaryLight} />
    </View>
  );
};

export default Loading;
