import boardsData from "@/services/mockData/boards.json"

class BoardService {
  constructor() {
    this.boards = [...boardsData]
    this.nextId = Math.max(...this.boards.map(b => b.Id)) + 1
    this.nextItemId = 100 // Start item IDs from 100 to avoid conflicts
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.boards]
  }

  async getById(id) {
    await this.delay()
    const board = this.boards.find(b => b.Id === id)
    if (!board) {
      throw new Error(`Board with id ${id} not found`)
    }
    return { ...board }
  }

  async create(boardData) {
    await this.delay()
    const newBoard = {
      Id: this.nextId++,
      ...boardData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.boards.unshift(newBoard)
    return { ...newBoard }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.boards.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Board with id ${id} not found`)
    }
    
    this.boards[index] = {
      ...this.boards[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.boards[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.boards.findIndex(b => b.Id === id)
    if (index === -1) {
      throw new Error(`Board with id ${id} not found`)
    }
    
    const deletedBoard = this.boards.splice(index, 1)[0]
    return { ...deletedBoard }
  }

  // Item management methods
  async createItem(itemData) {
    await this.delay()
    const newItem = {
      Id: this.nextItemId++,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Find the board and group to add the item to
    const board = this.boards.find(b => 
      b.groups?.some(g => g.Id === itemData.groupId)
    )
    
    if (board) {
      const group = board.groups.find(g => g.Id === itemData.groupId)
      if (group) {
        if (!group.items) group.items = []
        group.items.push(newItem)
        board.updatedAt = new Date().toISOString()
      }
    }
    
    return { ...newItem }
  }

  async updateItem(itemId, updates) {
    await this.delay()
    
    // Find the item across all boards and groups
    for (const board of this.boards) {
      if (board.groups) {
        for (const group of board.groups) {
          if (group.items) {
            const itemIndex = group.items.findIndex(item => item.Id === itemId)
            if (itemIndex !== -1) {
              group.items[itemIndex] = {
                ...group.items[itemIndex],
                ...updates,
                updatedAt: new Date().toISOString()
              }
              board.updatedAt = new Date().toISOString()
              return { ...group.items[itemIndex] }
            }
          }
        }
      }
    }
    
    throw new Error(`Item with id ${itemId} not found`)
  }

  async deleteItem(itemId) {
    await this.delay()
    
    // Find and delete the item across all boards and groups
    for (const board of this.boards) {
      if (board.groups) {
        for (const group of board.groups) {
          if (group.items) {
            const itemIndex = group.items.findIndex(item => item.Id === itemId)
            if (itemIndex !== -1) {
              const deletedItem = group.items.splice(itemIndex, 1)[0]
              board.updatedAt = new Date().toISOString()
              return { ...deletedItem }
            }
          }
        }
      }
    }
    
    throw new Error(`Item with id ${itemId} not found`)
  }
}

export const boardService = new BoardService()