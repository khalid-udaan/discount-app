import { useForm, useField } from "@shopify/react-form";
import { CurrencyCode } from "@shopify/react-i18n";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ButtonGroup, Button } from "@shopify/polaris";
import React, { useState, useCallback } from "react";

import ApplyTo from "../../custom_component/ApplyTo";
import {
  ActiveDatesCard,
  CombinationCard,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  DiscountStatus,
  RequirementType,
  SummaryCard,
  UsageLimitsCard,
  onBreadcrumbAction,
} from "@shopify/discount-app-components";
import {
  Banner,
  Card,
  Layout,
  Page,
  TextField,
  Stack,
  PageActions,
} from "@shopify/polaris";

import metafields from "../../metafields";
import { useAuthenticatedFetch } from "../../hooks";
const todaysDate = new Date();
const FUNCTION_ID = "01GJ2V7NVEMC02VKBHEVYT364G";
export default function VolumeNew() {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const currencyCode = CurrencyCode.Cad;
  // const [fieldChange, setFieldChange]=useState(true);
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);
  const authenticatedFetch = useAuthenticatedFetch();
  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      combinesWith,
      requirementType,
      requirementSubtotal,
      requirementQuantity,
      usageTotalLimit,
      usageOncePerCustomer,
      startDate,
      endDate,
      configuration,
    },

    submit,
    submitting,
    dirty,
    reset,
    submitErrors,
    makeClean,
  } = useForm({
    fields: {
      discountTitle: useField(""),
      discountMethod: useField(DiscountMethod.Code),
      discountCode: useField(""),
      combinesWith: useField({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      }),
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      usageTotalLimit: useField(null),
      usageOncePerCustomer: useField(false),
      startDate: useField(todaysDate),
      endDate: useField(null),
      configuration: {
        // Add quantity and percentage configuration
        quantity: useField("1"),
        percentage: useField(""),
        value: useField(""),
      },
    },
    onSubmit: async form => {
      console.log(form, "Form data");
      const discount = {
        functionId: FUNCTION_ID,
        combinesWith: form.combinesWith,
        startsAt: form.startDate,
        endsAt: form.endDate,
        metafields: [
          {
            namespace: metafields.namespace,
            key: metafields.key,
            type: "json",
            value: JSON.stringify({
              quantity: parseInt(form.configuration.quantity),
              percentage: parseFloat(form.configuration.percentage),
            }),
          },
        ],
      };

      console.log(discount, "discount data");

      let response;
      if (form.discountMethod === DiscountMethod.Automatic) {
        response = await authenticatedFetch("/api/discounts/automatic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountTitle,
            },
          }),
        });
      } else {
        response = await authenticatedFetch("/api/discounts/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            discount: {
              ...discount,
              title: form.discountCode,
              code: form.discountCode,
            },
          }),
        });
      }

      const {
        errors, // errors like missing scope access
        data,
      } = await response.json();
      const remoteErrors = errors || data?.discountCreate?.userErrors;

      if (remoteErrors?.length > 0) {
        return { status: "fail", errors: remoteErrors };
      }

      redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
        name: Redirect.ResourceType.Discount,
      });

      return { status: "success" };
    },
  });

  const handleFirstButtonClick = useCallback(() => {
    if (isFirstButtonActive) return;
    setIsFirstButtonActive(true);
  }, [isFirstButtonActive]);

  const handleSecondButtonClick = useCallback(() => {
    if (!isFirstButtonActive) return;
    setIsFirstButtonActive(false);
  }, [isFirstButtonActive]);

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner status="critical">
          <p>There were some issues with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => {
              return <li key={`${message}${index}`}>{message}</li>;
            })}
          </ul>
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Page
      title="Create volume discount"
      breadcrumbs={[
        {
          content: "Discounts",
          onAction: () => onBreadcrumbAction(redirect, true),
        },
      ]}
      primaryAction={{
        content: "Save",
        onAction: submit,
        disabled: !dirty,
        loading: submitting,
      }}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <form onSubmit={submit}>
            <MethodCard
              title="Volume"
              discountTitle={discountTitle}
              discountClass={DiscountClass.Product}
              discountCode={discountCode}
              discountMethod={discountMethod}
            />
            {/* <Card title="Volume">
              <Card.Section>
                <Stack>
                  <TextField
                    label="Minimum quantity"
                    {...configuration.quantity}
                  />
               
                  <TextField
                    label="Discount percentage"
                    {...configuration.percentage}
                    suffix="%"
                  /> 
                </Stack>
              </Card.Section>
            </Card> */}
            <Card title="Value">
              <Card.Section>
                <Stack>
                  <ButtonGroup segmented>
                    <Button
                      pressed={isFirstButtonActive}
                      onClick={handleFirstButtonClick}
                    >
                      Percentage
                    </Button>
                    <Button
                      pressed={!isFirstButtonActive}
                      onClick={handleSecondButtonClick}
                    >
                      FixedAmount
                    </Button>
                  </ButtonGroup>
                  {isFirstButtonActive ? (
                    <TextField
                      {...configuration.percentage}
                      suffix="%"
                      placeholder="0"
                    />
                  ) : (
                    <TextField
                      {...configuration.value}
                      prefix="$"
                      placeholder="0.00"
                    />
                  )}
                </Stack>
                <hr />
                <ApplyTo />
              </Card.Section>
            </Card>
            {discountMethod.value === DiscountMethod.Code && (
              <UsageLimitsCard
                totalUsageLimit={usageTotalLimit}
                oncePerCustomer={usageOncePerCustomer}
              />
            )}
            <CombinationCard
              combinableDiscountTypes={combinesWith}
              discountClass={DiscountClass.Product}
              discountDescriptor={
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value
              }
            />
            <ActiveDatesCard
              startDate={startDate}
              endDate={endDate}
              timezoneAbbreviation="EST"
            />
          </form>
        </Layout.Section>
        <Layout.Section secondary>
          <SummaryCard
            header={{
              discountMethod: discountMethod.value,
              discountDescriptor:
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value,
              appDiscountType: "Volume",
              isEditing: false,
            }}
            performance={{
              status: DiscountStatus.Scheduled,
              usageCount: 0,
            }}
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: usageOncePerCustomer.value,
              totalUsageLimit: usageTotalLimit.value,
            }}
            activeDates={{
              startDate: startDate.value,
              endDate: endDate.value,
            }}
          />
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              disabled: !dirty,
              loading: submitting,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => onBreadcrumbAction(redirect, true),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
