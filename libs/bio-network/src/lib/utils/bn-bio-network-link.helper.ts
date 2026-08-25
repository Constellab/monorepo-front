export class BnBioNetworkLinkHelper {
  /**
   * Get the link of a reaction from Rhea database
   * @param rheaId formatted as RHEA:12345 or 12345
   */
  public static getRheaDatabaseReactionLink(rheaId: string): string | null {
    if (rheaId == null) return null;

    // replace spaces with + and set to lower case for the search
    const cleanId: string = rheaId.replace('RHEA:', '');

    return `https://www.rhea-db.org/rhea/${cleanId}`;
  }

  /**
   * Get the link of a metabolite from Rhea database
   * @param chebi formatted as CHEBI:12345
   */
  public static getChebiLink(chebi: string): string | null {
    if (chebi == null) return null;
    return `https://www.ebi.ac.uk/chebi/searchId.do?chebiId=${chebi}`;
  }

  /**
   * Get the link of a reaction in Brenda from the ec number
   * @param ecNumber formatted as 1.2.3.11
   */
  public static getBrendaLink(ecNumber: string): string | null {
    if (ecNumber == null) return null;
    return `https://www.brenda-enzymes.org/enzyme.php?ecno=${ecNumber}`;
  }
}
