import { axios, extractBodyResolve } from "api/client";

const app = {
  createNewProject() {
    return extractBodyResolve(
      axios.post("/collection", {
        metadata: {
          namePrefix: "Untitled project",
        },
      })
    );
  },
  updateProject(projectId: string, metadata: any) {
    return extractBodyResolve(
      axios.put("/collection", {
        collectionId: projectId,
        metadata: metadata,
      })
    );
  },
  getProject(projectId: string) {
    return extractBodyResolve(axios.get(`/collection/${projectId}`));
  },
  getProjects() {
    return extractBodyResolve(axios.get("/collection/all"));
  },
  getImage(imageUri: string) {
    return extractBodyResolve(axios.get(`/collection/image/${imageUri}`));
  },
  addImage(
    projectId: string,
    base64String: string | ArrayBuffer | null,
    layerId: string,
    imageName: string
  ) {
    return extractBodyResolve(
      axios.post("/collection/image", {
        collectionId: projectId,
        layerId: layerId,
        imageName: imageName,
        imageData: base64String,
      })
    );
  },
  removeImage(imageUri: string) {
    return extractBodyResolve(axios.delete(`/collection/image/${imageUri}`));
  },
  collectionSuccess(collectionId: string) {
    return extractBodyResolve(
      axios.post("/collection/complete", {
        collectionId,
      })
    );
  },
  collectionFail(collectionId: string) {
    return extractBodyResolve(
      axios.post("/collection/failure", {
        collectionId,
        failureReason: "User terminated",
      })
    );
  },
  getUser() {
    return extractBodyResolve(axios.get("/user"));
  },
  getPromoImages() {
    return extractBodyResolve(axios.get("/sys-configs/promo-images"));
  },
  getPricingPlans() {
    return extractBodyResolve(axios.get("/sys-configs/pricing-plans"));
  },
  deleteCollection(collectionId: string) {
    return extractBodyResolve(axios.delete(`/collection/${collectionId}`));
  },
  checkoutPayment(pricingPackageName: string, billingPeriod: string, renew: boolean) {
    return extractBodyResolve(
      axios.post("/payment/checkout", {
        pricingPackageName,
        billingPeriod,
        renew
      })
    );
  },
  checkoutComplete() {
    return extractBodyResolve(
      axios.post("/user/upgrade", {})
    );
  }
};

export default app;
