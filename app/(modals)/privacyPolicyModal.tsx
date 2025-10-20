import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { spacingX, spacingY } from "@/constants/theme";
import { useLocalization } from "@/contexts/localizationContext";
import { useTheme } from "@/contexts/themeContext";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const PrivacyPolicyModal = () => {
  const { t } = useLocalization();
  const { colors } = useTheme();

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={t("profile.options.privacyPolicy")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Typo size={22} fontWeight="600">
            Privacy Policy for Go-To-Go Expense
          </Typo>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Privacy Policy
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Last updated: October 19, 2025
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy. This Privacy
              Policy has been created with the help of the Privacy Policy
              Generator.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Interpretation and Definitions
            </Typo>
            <Typo size={16} fontWeight="600">
              Interpretation
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The words whose initial letters are capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </Typo>
            <Typo size={16} fontWeight="600">
              Definitions
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              For the purposes of this Privacy Policy:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Account
                  </Typo>{" "}
                  means a unique account created for You to access our Service
                  or parts of our Service.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Affiliate
                  </Typo>{" "}
                  means an entity that controls, is controlled by, or is under
                  common control with a party, where ”control” means ownership
                  of 50% or more of the shares, equity interest or other
                  securities entitled to vote for election of directors or other
                  managing authority.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Application
                  </Typo>{" "}
                  refers to Go-To-Go Expense, the software program provided by
                  the Company.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Company
                  </Typo>{" "}
                  (referred to as either ”the Company”, ”We”, ”Us” or ”Our” in
                  this Agreement) refers to Go-To-Go Expense.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Country
                  </Typo>{" "}
                  refers to: Netherlands.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Device
                  </Typo>{" "}
                  means any device that can access the Service such as a
                  computer, a cell phone or a digital tablet.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Personal Data
                  </Typo>{" "}
                  is any information that relates to an identified or
                  identifiable individual.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Service
                  </Typo>{" "}
                  refers to the Application.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Service Provider
                  </Typo>{" "}
                  means any natural or legal person who processes the data on
                  behalf of the Company. It refers to third-party companies or
                  individuals employed by the Company to facilitate the Service,
                  to provide the Service on behalf of the Company, to perform
                  services related to the Service or to assist the Company in
                  analyzing how the Service is used.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    Usage Data
                  </Typo>{" "}
                  refers to data collected automatically, either generated by
                  the use of the Service or from the Service infrastructure
                  itself (for example, the duration of a page visit).
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  <Typo color={colors.neutral200} fontWeight="600">
                    You
                  </Typo>{" "}
                  means the individual accessing or using the Service, or the
                  company, or other legal entity on behalf of which such
                  individual is accessing or using the Service, as applicable.
                </Typo>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Collecting and Using Your Personal Data
            </Typo>
            <Typo size={16} fontWeight="600">
              Types of Data Collected
            </Typo>
            <Typo size={16} fontWeight="600">
              Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information that can be used to contact or
              identify You. Personally identifiable information may include, but
              is not limited to:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Email address
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  First name and last name
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Usage Data
                </Typo>
              </View>
            </View>
            <Typo size={16} fontWeight="600">
              Usage Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Usage Data is collected automatically when using the Service.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Usage Data may include information such as Your Devices Internet
              Protocol address (e.g. IP address), browser type, browser version,
              the pages of our Service that You visit, the time and date of Your
              visit, the time spent on those pages, unique device identifiers
              and other diagnostic data.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              When You access the Service by or through a mobile device, We may
              collect certain information automatically, including, but not
              limited to, the type of mobile device You use, Your mobile
              device’s unique ID, the IP address of Your mobile device, Your
              mobile operating system, the type of mobile Internet browser You
              use, unique device identifiers and other diagnostic data.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We may also collect information that Your browser sends whenever
              You visit Our Service or when You access the Service by or through
              a mobile device.
            </Typo>
            <Typo size={16} fontWeight="600">
              Information Collected while Using the Application
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              While using Our Application, in order to provide features of Our
              Application, We may collect, with Your prior permission:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Pictures and other information from your Device’s camera and
                  photo library.
                </Typo>
              </View>
            </View>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We use this information to provide features of Our Service, to
              improve and customize Our Service. The information may be uploaded
              to the Company’s servers and/or a Service Provider’s server or it
              may be simply stored on Your device.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              You can enable or disable access to this information at any time,
              through Your Device settings.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Use of Your Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The Company may use Personal Data for the following purposes:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  To provide and maintain our Service, including to monitor the
                  usage of our Service.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  To manage Your Account: to manage Your registration as a user
                  of the Service. The Personal Data You provide can give You
                  access to different functionalities of the Service that are
                  available to You as a registered user.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  For the performance of a contract: the development, compliance
                  and undertaking of the purchase contract for the products,
                  items or services You have purchased or of any other contract
                  with Us through the Service.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  To contact You: To contact You by email, telephone calls, SMS,
                  or other equivalent forms of electronic communication, such as
                  a mobile application’s push notifications regarding updates or
                  informative communications related to the functionalities,
                  products or contracted services, including the security
                  updates, when necessary or reasonable for their
                  implementation.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  To provide You with news, special offers, and general
                  information about other goods, services and events which We
                  offer that are similar to those that you have already
                  purchased or inquired about unless You have opted not to
                  receive such information.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  To manage Your requests: To attend and manage Your requests to
                  Us.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  For business transfers: We may use Your information to
                  evaluate or conduct a merger, divestiture, restructuring,
                  reorganization, dissolution, or other sale or transfer of some
                  or all of Our assets, whether as a going concern or as part of
                  bankruptcy, liquidation, or similar proceeding, in which
                  Personal Data held by Us about our Service users is among the
                  assets transferred.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  For other purposes: We may use Your information for other
                  purposes, such as data analysis, identifying usage trends,
                  determining the effectiveness of our promotional campaigns and
                  to evaluate and improve our Service, products, services,
                  marketing and your experience.
                </Typo>
              </View>
            </View>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We may share Your personal information in the following
              situations:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  With Service Providers: We may share Your personal information
                  with Service Providers to monitor and analyze the use of our
                  Service, to contact You.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  For business transfers: We may share or transfer Your personal
                  information in connection with, or during negotiations of, any
                  merger, sale of Company assets, financing, or acquisition of
                  all or a portion of Our business to another company.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  With Affiliates: We may share Your information with Our
                  affiliates, in which case we will require those affiliates to
                  honor this Privacy Policy. Affiliates include Our parent
                  company and any other subsidiaries, joint venture partners or
                  other companies that We control or that are under common
                  control with Us.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  With business partners: We may share Your information with Our
                  business partners to offer You certain products, services or
                  promotions.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  With other users: when You share personal information or
                  otherwise interact in the public areas with other users, such
                  information may be viewed by all users and may be publicly
                  distributed outside.
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  With Your consent: We may disclose Your personal information
                  for any other purpose with Your consent.
                </Typo>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Retention of Your Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The Company will retain Your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use Your Personal Data to the extent necessary to
              comply with our legal obligations (for example, if we are required
              to retain your data to comply with applicable laws), resolve
              disputes, and enforce our legal agreements and policies.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The Company will also retain Usage Data for internal analysis
              purposes. Usage Data is generally retained for a shorter period of
              time, except when this data is used to strengthen the security or
              to improve the functionality of Our Service, or We are legally
              obligated to retain this data for longer periods.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Transfer of Your Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Your information, including Personal Data, is processed at the
              Company’s operating offices and in any other places where the
              parties involved in the processing are located. It means that this
              information may be transferred to — and maintained on — computers
              located outside of Your state, province, country or other
              governmental jurisdiction where the data protection laws may
              differ from those from Your jurisdiction.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Your consent to this Privacy Policy followed by Your submission of
              such information represents Your agreement to that transfer.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The Company will take all steps reasonably necessary to ensure
              that Your data is treated securely and in accordance with this
              Privacy Policy and no transfer of Your Personal Data will take
              place to an organization or a country unless there are adequate
              controls in place including the security of Your data and other
              personal information.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Delete Your Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              You have the right to delete or request that We assist in deleting
              the Personal Data that We have collected about You.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Our Service may give You the ability to delete certain information
              about You from within the Service.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              You may update, amend, or delete Your information at any time by
              signing in to Your Account, if you have one, and visiting the
              account settings section that allows you to manage Your personal
              information. You may also contact Us to request access to,
              correct, or delete any personal information that You have provided
              to Us.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Please note, however, that We may need to retain certain
              information when we have a legal obligation or lawful basis to do
              so.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Disclosure of Your Personal Data
            </Typo>
            <Typo size={16} fontWeight="600">
              Business Transactions
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              If the Company is involved in a merger, acquisition or asset sale,
              Your Personal Data may be transferred. We will provide notice
              before Your Personal Data is transferred and becomes subject to a
              different Privacy Policy.
            </Typo>
            <Typo size={16} fontWeight="600">
              Law enforcement
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Under certain circumstances, the Company may be required to
              disclose Your Personal Data if required to do so by law or in
              response to valid requests by public authorities (e.g. a court or
              a government agency).
            </Typo>
            <Typo size={16} fontWeight="600">
              Other legal requirements
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The Company may disclose Your Personal Data in the good faith
              belief that such action is necessary to:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Comply with a legal obligation
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Protect and defend the rights or property of the Company
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Prevent or investigate possible wrongdoing in connection with
                  the Service
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Protect the personal safety of Users of the Service or the
                  public
                </Typo>
              </View>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  Protect against legal liability
                </Typo>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Security of Your Personal Data
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              The security of Your Personal Data is important to Us, but
              remember that no method of transmission over the Internet, or
              method of electronic storage is 100% secure. While We strive to
              use commercially reasonable means to protect Your Personal Data,
              We cannot guarantee its absolute security.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Children’s Privacy
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Our Service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 13. If You are a parent or guardian and You are
              aware that Your child has provided Us with Personal Data, please
              contact Us. If We become aware that We have collected Personal
              Data from anyone under the age of 13 without verification of
              parental consent, We take steps to remove that information from
              Our servers.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              If We need to rely on consent as a legal basis for processing Your
              information and Your country requires consent from a parent, We
              may require Your parent’s consent before We collect and use that
              information.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Links to Other Websites
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Our Service may contain links to other websites that are not
              operated by Us. If You click on a third party link, You will be
              directed to that third party’s site. We strongly advise You to
              review the Privacy Policy of every site You visit.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Changes to this Privacy Policy
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We may update Our Privacy Policy from time to time. We will notify
              You of any changes by posting the new Privacy Policy on this page.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              We will let You know via email and/or a prominent notice on Our
              Service, prior to the change becoming effective and update the
              ”Last updated” date at the top of this Privacy Policy.
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </Typo>
          </View>

          <View style={styles.section}>
            <Typo size={18} fontWeight="600">
              Contact Us
            </Typo>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              If you have any questions about this Privacy Policy, You can
              contact us:
            </Typo>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Typo color={colors.neutral200} style={styles.bullet}>
                  •
                </Typo>
                <Typo color={colors.neutral200} style={styles.paragraph}>
                  By email: info@gokhanyaka.com
                </Typo>
              </View>
            </View>
            <Typo color={colors.neutral200} style={styles.paragraph}>
              Generated using Privacy Policies Generator
            </Typo>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  content: {
    paddingBottom: spacingY._30,
    gap: spacingY._15,
  },
  section: {
    gap: spacingY._10,
  },
  paragraph: {
    lineHeight: verticalScale(22),
  },
  list: {
    gap: spacingY._7,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacingX._10,
  },
  bullet: {
    marginTop: verticalScale(2),
  },
});
