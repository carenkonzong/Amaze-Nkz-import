export type Facture = {
  numeroFacture?: string;
  expediteur: informationExpediteur;
  destinataire: informationDestinataire;
  infoColis: infoColis;
  detailFacture: detailFacture;
  totalFacture: string;
};

export type informationExpediteur = {
  nomExpediteur: string;
  telephoneExpediteur: string;
};

export type informationDestinataire = {
  nomDestinataire: string;
  telephoneDestinataire: string;
  villeDestinataire: string;
};

export type infoColis = {
  descriptionColis: string;
  poidsColis: string;
  prixUnitaire: string;
  prixColis: string;
};

export type detailFacture = {
  valeurColis: string;
  assurance: string;
  montantAssurance?: string;
  modePaiement: string;
};
